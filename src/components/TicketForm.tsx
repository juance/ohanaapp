
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentMethod, LaundryOption } from '@/lib/types';
import { Toaster } from "sonner";
import { storeTicketData } from '@/lib/dataService';
import { SelectedDryCleaningItem } from './ticket-form/types';

// Import our components
import ClientInformation from './ticket-form/ClientInformation';
import LaundryServices from './ticket-form/LaundryServices';
import DryCleaningItems from './ticket-form/DryCleaningItems';
import LaundryOptionsSelector from './ticket-form/LaundryOptionsSelector';
import PaymentMethodSelector from './ticket-form/PaymentMethodSelector';
import TotalDisplay from './ticket-form/TotalDisplay';

// Import our data
import { 
  laundryServices,
  dryCleaningOptions,
  laundryOptionsList,
  paymentMethods
} from './ticket-form/data';

const TicketForm = () => {
  // Client information state
  const [clientData, setClientData] = useState({ clientName: '', phoneNumber: '' });
  
  // Service selection state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<SelectedDryCleaningItem[]>([]);
  const [selectedLaundryOptions, setSelectedLaundryOptions] = useState<string[]>([]);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleClientDataChange = (field: keyof typeof clientData, value: string) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };
  
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
    if (!clientData.clientName.trim()) {
      toast.error('Please enter a client name');
      setIsSubmitting(false);
      return;
    }
    
    if (!clientData.phoneNumber.trim()) {
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
      const dryCleaningItems = selectedDryCleaningItems.map(item => {
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
          ...(selectedServices.length > 0 ? { valetQuantity: 1 } : {})
        },
        {
          name: clientData.clientName,
          phoneNumber: clientData.phoneNumber
        },
        dryCleaningItems,
        laundryOptions
      );
      
      if (success) {
        // Show success message
        toast.success('Ticket created successfully', {
          description: `Ticket #${ticketNumber} for ${clientData.clientName}`,
        });
        
        // Reset form
        setClientData({ clientName: '', phoneNumber: '' });
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
            <ClientInformation 
              clientData={clientData}
              onChange={handleClientDataChange}
            />
            
            <LaundryServices 
              laundryServices={laundryServices}
              selectedServices={selectedServices}
              onServiceToggle={handleServiceToggle}
            />
            
            <DryCleaningItems 
              dryCleaningOptions={dryCleaningOptions}
              selectedItems={selectedDryCleaningItems}
              onItemToggle={handleDryCleaningToggle}
              onQuantityChange={handleDryCleaningQuantityChange}
            />
            
            <LaundryOptionsSelector 
              options={laundryOptionsList}
              selectedOptions={selectedLaundryOptions}
              onOptionToggle={handleLaundryOptionToggle}
            />
            
            <PaymentMethodSelector 
              paymentMethods={paymentMethods}
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <TotalDisplay 
            total={calculateTotal()} 
            isSubmitting={isSubmitting}
          />
        </CardFooter>
      </Card>
    </form>
  );
};

export default TicketForm;
