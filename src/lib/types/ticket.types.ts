
// Ticket types

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: string;
  isPaid: boolean;
  valetQuantity: number;
  createdAt: string;
  deliveredDate?: string;
}

export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}

export interface LaundryOption {
  id: string;
  name: string;
  optionType: string;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TicketService {
  id: string;
  name: string;
  price?: number;
  quantity?: number;
}
