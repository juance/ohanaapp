
// Payment method types
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'cuentaDni' | 'transfer' | string;

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
  valetQuantity?: number;
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

export interface LaundryOption {
  id?: string; // Made optional to match usage
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
  quantity?: number;
}

export interface TicketService {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}
