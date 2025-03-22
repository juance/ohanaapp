
import { Ticket, LaundryOption } from '@/lib/types';
import { useCustomerForm } from './ticket/useCustomerForm';
import { useValetForm } from './ticket/useValetForm';
import { useDryCleaningForm } from './ticket/useDryCleaningForm';
import { useTicketFormState } from './ticket/useTicketFormState';
import { useTicketFormSubmit } from './ticket/useTicketFormSubmit';

export const useTicketForm = (onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void) => {
  // Import all smaller hooks
  const customerForm = useCustomerForm();
  const valetForm = useValetForm();
  const dryCleaningForm = useDryCleaningForm();
  const ticketFormState = useTicketFormState();
  
  // Combine all form state for the submit handler
  const formState = {
    customerName: customerForm.customerName,
    phoneNumber: customerForm.phoneNumber,
    valetQuantity: valetForm.valetQuantity,
    useFreeValet: valetForm.useFreeValet,
    paymentMethod: ticketFormState.paymentMethod,
    totalPrice: ticketFormState.totalPrice,
    activeTab: ticketFormState.activeTab,
    date: ticketFormState.date,
    selectedDryCleaningItems: dryCleaningForm.selectedDryCleaningItems,
    getSelectedLaundryOptions: valetForm.getSelectedLaundryOptions,
    resetCustomerForm: customerForm.resetCustomerForm,
    resetValetForm: valetForm.resetValetForm,
    resetDryCleaningForm: dryCleaningForm.resetDryCleaningForm,
    resetTicketFormState: ticketFormState.resetTicketFormState
  };
  
  // Use the submit handler
  const { handleSubmit } = useTicketFormSubmit(formState, onTicketGenerated);
  
  return {
    // Customer form data
    ...customerForm,
    
    // Valet form data
    ...valetForm,
    
    // Dry cleaning form data
    ...dryCleaningForm,
    
    // Ticket form state
    ...ticketFormState,
    
    // Form submission
    handleSubmit
  };
};
