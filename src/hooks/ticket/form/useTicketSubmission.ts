
import { toast } from '@/lib/toast';
import { storeTicket } from '@/lib/dataService';
import { PaymentMethod, DryCleaningItem, LaundryOption } from '@/lib/types';
import { useFormValidation } from './useFormValidation';

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
      const dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[] = selectedDryCleaningItems.map(item => {
        const itemDetails = dryCleaningOptions.find(opt => opt.id === item.id);
        return {
          name: itemDetails?.name || '',
          quantity: item.quantity,
          price: (itemDetails?.price || 0) * item.quantity
        };
      });

      // Prepare laundry options - convert strings to LaundryOption objects
      const laundryOptions: LaundryOption[] = selectedLaundryOptions.map(option => ({
        id: option,
        name: option,
        price: 0
      }));

      // Store the ticket data
      const success = await storeTicket(
        {
          totalPrice: calculateTotal(),
          paymentMethod,
          valetQuantity: 1 // Default to 1, could be made configurable
          // Removed ticketNumber as it's not in the expected type
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
          description: `Ticket for ${clientName}`,
        });

        // Reset form
        resetForm();
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
    handleSubmit
  };
};
