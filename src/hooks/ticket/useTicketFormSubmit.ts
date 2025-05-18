
import { useTicketSubmit } from './useTicketSubmit';
import { Ticket, LaundryOption } from '@/lib/types';
import { TicketFormState } from '@/lib/types/ticket.types';  // Import the specific type

// Use the specific type import
export const useTicketFormSubmit = (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
) => {
  // Use the refactored hook
  return useTicketSubmit(formState, onTicketGenerated);
};
