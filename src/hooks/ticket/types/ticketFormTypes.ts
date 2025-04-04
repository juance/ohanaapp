
import { LaundryOption, Ticket } from '@/lib/types';

export interface TicketFormState {
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

export interface UseTicketFormSubmitProps {
  formState: TicketFormState;
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void;
}
