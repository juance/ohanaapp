
import { useState } from 'react';
import { LaundryOption, Ticket } from '@/lib/types';
import { TicketFormState, UseTicketFormSubmitProps } from './types/ticketFormTypes';
import { validateTicketForm } from './utils/formValidation';
import { handleFormSubmission } from './utils/submissionHandler';

export const useTicketFormSubmit = ({
  formState,
  onTicketGenerated
}: UseTicketFormSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Validate the form
    if (!validateTicketForm(formState)) {
      setIsSubmitting(false);
      return;
    }
    
    // Submit the form
    await handleFormSubmission(formState, onTicketGenerated);
    
    setIsSubmitting(false);
  };

  return { handleSubmit, isSubmitting };
};
