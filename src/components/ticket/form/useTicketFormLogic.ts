
import { useState } from 'react';
import { PaymentMethod, DryCleaningItem, LaundryOption } from '@/lib/types';
import { toast } from '@/lib/toast';
import { storeTicketData } from '@/lib/dataService';

export const useTicketFormLogic = () => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<{id: string, quantity: number}[]>([]);
  const [selectedLaundryOptions, setSelectedLaundryOptions] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock laundry services
  const laundryServices = [
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

  return {
    clientName,
    setClientName,
    phoneNumber,
    setPhoneNumber,
    selectedServices,
    setSelectedServices,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    selectedLaundryOptions,
    setSelectedLaundryOptions,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    setIsSubmitting,
    laundryServices,
    dryCleaningOptions,
    laundryOptionsList,
    paymentMethods,
    calculateTotal,
    handleServiceToggle,
    handleDryCleaningToggle,
    handleDryCleaningQuantityChange,
    handleLaundryOptionToggle,
    handleSubmit
  };
};
