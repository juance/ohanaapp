
// Add payment method types if not already defined
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'cuentaDni' | 'transfer' | string;

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerName?: string;
  clientName?: string;
  phoneNumber?: string;
  total: number;
  totalPrice?: number;
  status: string;
  paymentMethod: PaymentMethod;
  date: string;
  isPaid: boolean;
  createdAt: string;
  customerId?: string;
  items?: DryCleaningItem[];
  valetQuantity?: number;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface LaundryOption {
  id: string;
  type: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}

export interface TicketService {
  name: string;
  price: number;
  quantity: number;
}
