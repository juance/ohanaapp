
// Ticket types

export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  customerName?: string;
  customerPhone?: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: string;
  isPaid: boolean;
  valetQuantity: number;
  createdAt: string;
  deliveredDate: string | null;
  customerId?: string;
  basketTicketNumber?: string;
  dryCleaningItems?: DryCleaningItem[];
  laundryOptions?: LaundryOption[];
  ticketData?: any;
  services?: TicketService[];
}

export interface DryCleaningItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ticketId?: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  optionType: string;
}

export interface LaundryOption {
  id?: string;
  name: string;
  optionType: string;
  price?: number;
  ticketId?: string;
  createdAt?: string;
}

export interface TicketService {
  id: string;
  name: string;
  quantity: number;
  price: number;
}
