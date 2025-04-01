
import { toast } from 'sonner';
import { storeTicketData } from '@/lib/dataService';
import { LaundryOption, Ticket } from '@/lib/types';
import { TicketFormState } from '../types/ticketFormTypes';
import { 
  prepareTicketData, 
  prepareCustomerData, 
  prepareDryCleaningItems, 
  createTicketForPreview 
} from './ticketGenerator';

export const handleFormSubmission = async (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
): Promise<boolean> => {
  const {
    useFreeValet,
    isPaidInAdvance,
    getSelectedLaundryOptions,
    resetCustomerForm,
    resetValetForm,
    resetDryCleaningForm,
    resetTicketFormState
  } = formState;
  
  try {
    // Prepare the data
    const ticketData = prepareTicketData(formState);
    const customerData = prepareCustomerData(formState);
    const dryCleaningItemsData = prepareDryCleaningItems(formState);
    const laundryOptions = getSelectedLaundryOptions();
    
    // Store the ticket
    const success = await storeTicketData(
      ticketData,
      customerData,
      dryCleaningItemsData,
      laundryOptions
    );
    
    if (success) {
      if (useFreeValet) {
        toast.success('Ticket de valet gratis generado correctamente');
      } else if (isPaidInAdvance) {
        toast.success('Ticket generado correctamente (Pagado por adelantado)');
      } else {
        toast.success('Ticket generado correctamente');
      }
      
      // Create a ticket object for printing
      if (onTicketGenerated) {
        const ticketForPrint = await createTicketForPreview(formState);
        onTicketGenerated(ticketForPrint, laundryOptions);
      }
      
      // Reset form
      resetCustomerForm();
      resetValetForm();
      resetDryCleaningForm();
      resetTicketFormState();
      
      return true;
    } else {
      toast.error('Error al generar el ticket');
      return false;
    }
  } catch (error) {
    console.error('Error submitting ticket:', error);
    toast.error('Error al generar el ticket');
    return false;
  }
};
