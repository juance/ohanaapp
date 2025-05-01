
import { toast } from '@/lib/toast';
import { storeTicket } from '@/lib/dataService';
import { PaymentMethod, LaundryOption } from '@/lib/types';
import { useFormValidation } from './useFormValidation';
import { useQueryClient } from '@tanstack/react-query';

export const useTicketSubmission = (
  clientName: string,
  phoneNumber: string,
  selectedServices: string[],
  selectedDryCleaningItems: {id: string, quantity: number}[],
  selectedLaundryOptions: string[],
  paymentMethod: PaymentMethod,
  laundryServices: { id: string, name: string, price: number }[],
  dryCleaningOptions: { id: string, name: string, price: number }[],
  calculateTotal: () => number,
  setIsSubmitting: (isSubmitting: boolean) => void,
  resetForm: () => void
) => {
  const { validateClientInfo, validateServices } = useFormValidation();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!validateClientInfo(clientName, phoneNumber)) {
      setIsSubmitting(false);
      return;
    }

    if (!validateServices(selectedServices, selectedDryCleaningItems)) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare dry cleaning items
      const dryCleaningItems = selectedDryCleaningItems.map(item => {
        const itemDetails = dryCleaningOptions.find(opt => opt.id === item.id);
        return {
          name: itemDetails?.name || '',
          quantity: item.quantity,
          price: (itemDetails?.price || 0) * item.quantity
        };
      });

      // Prepare laundry options - convert strings to LaundryOption objects
      const laundryOptions = selectedLaundryOptions.map(option => ({
        name: option,
        optionType: 'preference'
      })) as LaundryOption[];

      // Store the ticket using a single object parameter
      const success = await storeTicket({
        totalPrice: calculateTotal(),
        paymentMethod,
        valetQuantity: 1,
        status: 'pending',
        isPaid: false,
        clientName,
        phoneNumber,
        deliveredDate: null,
        customerData: {
          name: clientName,
          phoneNumber
        },
        dryCleaningItems,
        laundryOptions
      });

      if (success) {
        // Invalidate the pickupTickets query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });

        // Show success message
        toast({
          title: 'Ticket created successfully',
          description: `Ticket for ${clientName}`
        });

        // Reset form
        resetForm();
      } else {
        toast({
          title: 'Failed to create ticket',
          description: 'Please try again or check your connection'
        });
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error creating ticket',
        description: 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit
  };
};
