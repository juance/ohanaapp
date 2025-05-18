
// Payment method types
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'cuenta_dni' | 'transfer' | string;

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  customerName?: string;
  phoneNumber: string;
  total: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'canceled' | string;
  paymentMethod: PaymentMethod;
  date: string;
  isPaid: boolean;
  createdAt: string;
  customerId?: string;
  items?: DryCleaningItem[];
  valetQuantity?: number; // Make sure this exists
  deliveredDate?: string;
  basketTicketNumber?: string;
  services?: TicketService[];
  laundryOptions?: LaundryOption[];
  dryCleaningItems?: DryCleaningItem[];
  usesFreeValet?: boolean;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ticketId?: string;
}

// Make sure LaundryOption interface matches the one used everywhere
export interface LaundryOption {
  id?: string; // Optional to be compatible with both versions
  name: string;
  optionType: string;
  type?: string; // For backwards compatibility
  price?: number;
  ticketId?: string;
  createdAt?: string;
  selected?: boolean;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  optionType: string;
  description?: string;
  quantity?: number;
}

export interface TicketService {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

// Add TicketFormState interface for useTicketForm.ts
export interface TicketFormState {
  customerName: string;
  phoneNumber: string;
  valetQuantity: number;
  useFreeValet: boolean;
  paymentMethod: PaymentMethod;
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
