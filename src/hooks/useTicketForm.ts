
import { Ticket, LaundryOption } from '@/lib/types';
import { useState } from 'react';
import { useCustomerForm } from './ticket/useCustomerForm';
import { useValetForm } from './ticket/useValetForm';
import { useDryCleaningForm } from './ticket/useDryCleaningForm';
import { useTicketFormState } from './ticket/useTicketFormState';
import { useTicketFormSubmit } from './ticket/useTicketFormSubmit';
import { TicketFormState } from '@/lib/types/ticket.types';  // Added specific import

export const useTicketForm = (onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void) => {
  // New state for paid in advance option
  const [isPaidInAdvance, setIsPaidInAdvance] = useState<boolean>(false);
  
  // Add state for free valet dialog
  const [showFreeValetDialog, setShowFreeValetDialog] = useState<boolean>(false);
  
  // Import all smaller hooks
  const customerForm = useCustomerForm();
  const valetForm = useValetForm();
  const dryCleaningForm = useDryCleaningForm();
  const ticketFormState = useTicketFormState();
  
  // Combine all form state for the submit handler
  const formState: TicketFormState = {  // Added explicit type annotation
    customerName: customerForm.customerName,
    phoneNumber: customerForm.phoneNumber,
    valetQuantity: valetForm.valetQuantity, // Use valetQuantity instead of quantity
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
    resetTicketFormState: ticketFormState.resetTicketFormState,
    isPaidInAdvance // Add the new field
  };
  
  // Use the submit handler
  const { handleSubmit } = useTicketFormSubmit(formState, onTicketGenerated);
  
  return {
    // Customer form data
    ...customerForm,
    
    // Valet form data
    ...valetForm,
    
    // For backwards compatibility
    valetQuantity: valetForm.valetQuantity,
    setValetQuantity: valetForm.setValetQuantity,
    separateByColor: valetForm.separateByColor, 
    setSeparateByColor: valetForm.setSeparateByColor,
    delicateDry: valetForm.delicateDry,
    setDelicateDry: valetForm.setDelicateDry,
    stainRemoval: valetForm.stainRemoval,
    setStainRemoval: valetForm.setStainRemoval,
    bleach: valetForm.bleach,
    setBleach: valetForm.setBleach,
    noFragrance: valetForm.noFragrance,
    setNoFragrance: valetForm.setNoFragrance,
    noDry: valetForm.noDry,
    setNoDry: valetForm.setNoDry,
    
    // Dry cleaning form data
    ...dryCleaningForm,
    
    // Ticket form state
    ...ticketFormState,
    
    // Paid in advance option
    isPaidInAdvance,
    setIsPaidInAdvance,
    
    // Free valet dialog state
    showFreeValetDialog,
    setShowFreeValetDialog,
    
    // Form submission
    handleSubmit
  };
};
