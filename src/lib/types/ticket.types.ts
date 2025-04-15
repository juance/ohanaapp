
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni' | 'credit_card' | 'debit_card' | 'transfer';

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
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

export interface Ticket {
  id?: string;
  ticketNumber: string;
  basketTicketNumber?: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  deliveredDate?: string;
  isPaid?: boolean;
  valetQuantity?: number;
  services: Array<{
    name: string;
    price?: number;
    quantity?: number;
  }>;
  isPaidInAdvance?: boolean;
  usesFreeValet?: boolean;
  isCanceled?: boolean;
  deliveredAt?: string;
  dryCleaningItems?: Array<DryCleaningItem>;
  laundryOptions?: Array<LaundryOption>;
  pendingSync?: boolean;
}
