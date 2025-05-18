
// Add payment method types if not already defined
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'cuentaDni' | 'transfer' | string;

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerName?: string;
  clientName?: string;
  phoneNumber?: string;
  total: number;
  totalPrice: number; // Add this property
  status: string;
  paymentMethod: PaymentMethod;
  date: string;
  isPaid: boolean;
  createdAt: string;
  customerId?: string;
  items?: DryCleaningItem[];
  valetQuantity?: number;
  deliveredDate?: string;
  basketTicketNumber?: string; // Add this property
  services?: TicketService[]; // Add this property
  laundryOptions?: LaundryOption[];
  dryCleaningItems?: DryCleaningItem[]; // Add this property
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ticketId?: string;
}

export interface LaundryOption {
  id?: string;
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
