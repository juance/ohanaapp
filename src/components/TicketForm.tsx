
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { LaundryService, PaymentMethod } from '@/lib/types';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

// Mock laundry services
const laundryServices: LaundryService[] = [
  { id: '1', name: 'Washing', price: 15 },
  { id: '2', name: 'Drying', price: 10 },
  { id: '3', name: 'Ironing', price: 20 },
  { id: '4', name: 'Folding', price: 5 },
  { id: '5', name: 'Stain Removal', price: 25 },
  { id: '6', name: 'Blanket Cleaning', price: 35 },
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = laundryServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };
  
  const handleServiceToggle = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, we would make an API call to create the ticket here
    setTimeout(() => {
      const ticketNumber = String(Math.floor(Math.random() * 10000000)).padStart(8, '0');
      
      // Show success message
      toast.success('Ticket created successfully', {
        description: `Ticket #${ticketNumber} for ${clientName}`,
      });
      
      // Reset form
      setClientName('');
      setPhoneNumber('');
      setSelectedServices([]);
      setPaymentMethod('cash');
      setIsSubmitting(false);
    }, 1500);
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
