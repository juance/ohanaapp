
import { useTicketSubmit } from './useTicketSubmit';
import { Ticket, LaundryOption } from '@/lib/types';

// Types for the combined form state
interface TicketFormState {
  customerName: string;
  phoneNumber: string;
  valetQuantity: number;
  useFreeValet: boolean;
  paymentMethod: string;
  totalPrice: number;
  activeTab: string;
  date: Date;
  selectedDryCleaningItems: any[];
  getSelectedLaundryOptions: () => LaundryOption[];
  resetCustomerForm: () => void;
  resetValetForm: () => void;
  resetDryCleaningForm: () => void;
  resetTicketFormState: () => void;
  isPaidInAdvance?: boolean;
}

export const useTicketFormSubmit = (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
) => {
  // Use the refactored hook
  return useTicketSubmit(formState, onTicketGenerated);
};
