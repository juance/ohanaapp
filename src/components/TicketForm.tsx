
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LaundryService, PaymentMethod, DryCleaningItem, LaundryOption } from '@/lib/types';
import { toast } from '@/lib/toast';
import { Check } from 'lucide-react';
import { storeTicketData } from '@/lib/dataService';

// Mock laundry services
const laundryServices: LaundryService[] = [
  { id: '1', name: 'Washing', price: 15 },
  { id: '2', name: 'Drying', price: 10 },
  { id: '3', name: 'Ironing', price: 20 },
  { id: '4', name: 'Folding', price: 5 },
  { id: '5', name: 'Stain Removal', price: 25 },
  { id: '6', name: 'Blanket Cleaning', price: 35 },
];

// Dry cleaning items
const dryCleaningOptions = [
  { id: 'shirt', name: 'Shirt', price: 20 },
  { id: 'pants', name: 'Pants', price: 25 },
  { id: 'suit', name: 'Suit', price: 45 },
  { id: 'dress', name: 'Dress', price: 35 },
  { id: 'coat', name: 'Coat', price: 50 },
  { id: 'blanket', name: 'Blanket', price: 40 },
];

// Laundry options
const laundryOptionsList = [
  { id: 'color_separation', label: 'Color Separation' },
  { id: 'delicate_wash', label: 'Delicate Wash' },
  { id: 'extra_rinse', label: 'Extra Rinse' },
  { id: 'heavy_soil', label: 'Heavy Soil Treatment' },
  { id: 'stain_treatment', label: 'Stain Treatment' },
];

// Payment method options
const paymentMethods = [
  { id: 'cash', label: 'Cash' },
  { id: 'debit', label: 'Debit Card' },
  { id: 'mercado_pago', label: 'Mercado Pago' },
  { id: 'cuenta_dni', label: 'Cuenta DNI' },
];

const TicketForm = () => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<{id: string, quantity: number}[]>([]);
  const [selectedLaundryOptions, setSelectedLaundryOptions] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = () => {
    // Calculate total for regular services
    const servicesTotal = selectedServices.reduce((total, serviceId) => {
      const service = laundryServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);

    // Calculate total for dry cleaning items
    const dryCleaningTotal = selectedDryCleaningItems.reduce((total, item) => {
      const dryCleaningItem = dryCleaningOptions.find(dci => dci.id === item.id);
      return total + ((dryCleaningItem?.price || 0) * item.quantity);
    }, 0);

    return servicesTotal + dryCleaningTotal;
  };

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleDryCleaningToggle = (itemId: string) => {
    const existingItem = selectedDryCleaningItems.find(item => item.id === itemId);

    if (existingItem) {
      // Remove the item
      setSelectedDryCleaningItems(selectedDryCleaningItems.filter(item => item.id !== itemId));
    } else {
      // Add the item with quantity 1
      setSelectedDryCleaningItems([...selectedDryCleaningItems, { id: itemId, quantity: 1 }]);
    }
  };

  const handleDryCleaningQuantityChange = (itemId: string, quantity: number) => {
    setSelectedDryCleaningItems(
      selectedDryCleaningItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleLaundryOptionToggle = (optionId: string) => {
    if (selectedLaundryOptions.includes(optionId)) {
      setSelectedLaundryOptions(selectedLaundryOptions.filter(id => id !== optionId));
    } else {
      setSelectedLaundryOptions([...selectedLaundryOptions, optionId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!clientName.trim()) {
      toast.error('Please enter a client name');
      setIsSubmitting(false);
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error('Please enter a phone number');
      setIsSubmitting(false);
      return;
    }

    if (selectedServices.length === 0 && selectedDryCleaningItems.length === 0) {
      toast.error('Please select at least one service or dry cleaning item');
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate ticket number
      const ticketNumber = String(Math.floor(Math.random() * 10000000)).padStart(8, '0');

      // Prepare dry cleaning items
      const dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[] = selectedDryCleaningItems.map(item => {
        const itemDetails = dryCleaningOptions.find(opt => opt.id === item.id);
        return {
          name: itemDetails?.name || '',
          quantity: item.quantity,
          price: (itemDetails?.price || 0) * item.quantity
        };
      });

      // Prepare laundry options
      const laundryOptions: LaundryOption[] = selectedLaundryOptions.map(option => option as LaundryOption);

      // Store the ticket data
      const success = await storeTicketData(
        {
          ticketNumber,
          totalPrice: calculateTotal(),
          paymentMethod,
          valetQuantity: 1 // Default to 1, could be made configurable
        },
        {
          name: clientName,
          phoneNumber
        },
        dryCleaningItems,
        laundryOptions
      );

      if (success) {
        // Show success message
        toast.success('Ticket created successfully', {
          description: `Ticket #${ticketNumber} for ${clientName}`,
        });

        // Reset form
        setClientName('');
        setPhoneNumber('');
        setSelectedServices([]);
        setSelectedDryCleaningItems([]);
        setSelectedLaundryOptions([]);
        setPaymentMethod('cash');
      } else {
        toast.error('Failed to create ticket', {
          description: 'Please try again or check your connection',
        });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Error creating ticket', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Client Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+54 9 11 XXXX XXXX"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Services</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {laundryServices.map((service) => (
                  <div
                    key={service.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                      selectedServices.includes(service.id)
                        ? 'border-laundry-500 bg-laundry-50'
                        : 'border-border'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service.id}`}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => {}}
                        className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={`service-${service.id}`}
                        className="text-sm font-medium"
                      >
                        {service.name}
                      </label>
                    </div>
                    <span className="text-sm font-semibold">${service.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dry Cleaning Items</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {dryCleaningOptions.map((item) => {
                  const selectedItem = selectedDryCleaningItems.find(i => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex cursor-pointer flex-col rounded-lg border p-3 transition-all ${
                        selectedItem
                          ? 'border-laundry-500 bg-laundry-50'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`drycleaning-${item.id}`}
                            checked={!!selectedItem}
                            onCheckedChange={() => handleDryCleaningToggle(item.id)}
                            className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
                          />
                          <label
                            htmlFor={`drycleaning-${item.id}`}
                            className="text-sm font-medium"
                          >
                            {item.name}
                          </label>
                        </div>
                        <span className="text-sm font-semibold">${item.price}</span>
                      </div>

                      {selectedItem && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedItem.quantity > 1) {
                                  handleDryCleaningQuantityChange(item.id, selectedItem.quantity - 1);
                                }
                              }}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-4 text-center">
                              {selectedItem.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDryCleaningQuantityChange(item.id, selectedItem.quantity + 1);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Laundry Options</h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {laundryOptionsList.map((option) => (
                  <div
                    key={option.id}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                      selectedLaundryOptions.includes(option.id)
                        ? 'border-laundry-500 bg-laundry-50'
                        : 'border-border'
                    }`}
                    onClick={() => handleLaundryOptionToggle(option.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={selectedLaundryOptions.includes(option.id)}
                        onCheckedChange={() => {}}
                        className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
                      />
                      <label
                        htmlFor={`option-${option.id}`}
                        className="text-sm font-medium"
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                        paymentMethod === method.id
                          ? 'border-laundry-500 bg-laundry-50'
                          : 'border-border'
                      }`}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={method.id}
                          id={`payment-${method.id}`}
                          className="data-[state=checked]:border-laundry-500 data-[state=checked]:text-laundry-500"
                        />
                        <Label
                          htmlFor={`payment-${method.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {method.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
          <div className="text-lg font-medium">
            Total: <span className="text-laundry-700">${calculateTotal()}</span>
          </div>
          <Button
            type="submit"
            className="bg-laundry-500 hover:bg-laundry-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Create Ticket
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default TicketForm;
