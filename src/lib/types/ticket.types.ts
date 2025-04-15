
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
  deliveredAt?: string;
  services?: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
}

export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

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

export interface DryCleaningItem {
  id?: string;
  ticketId?: string;
  name: string;
  quantity: number;
  price: number;
}
