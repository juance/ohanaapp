
export interface Ticket {
  id: string;
  ticketNumber: string;
  basketTicketNumber?: string;
  clientName?: string;
  phoneNumber?: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  valetQuantity?: number;
  dryCleaningItems?: any[];
  laundryOptions?: any[];
  createdAt: string;
  pendingSync?: boolean;
  deliveredDate?: string;
  services?: Array<{name: string; quantity?: number}>;

  // Additional fields for database compatibility
  basket_ticket_number?: string;
  ticket_number?: string;
}

export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface DryCleaningItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  ticketId?: string;
}

export interface LaundryOption {
  id: string;
  name: string;
  price: number;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}
