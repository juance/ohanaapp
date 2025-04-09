
import { toast } from '@/lib/toast';
import { storeTicketData } from '@/lib/dataService';
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
