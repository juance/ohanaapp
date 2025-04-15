
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
  // Campos adicionales que vienen de la base de datos
  basket_ticket_number?: string;
  cancel_reason?: string;
  customer_id?: string;
  date?: string;
  delivered_date?: string;
  is_canceled?: boolean;
  is_paid?: boolean;
  payment_amount?: number;
  payment_status?: string;
  ticket_number?: string;
  updated_at?: string;
  created_at?: string;
  valet_quantity?: number;
  updatedAt?: string;
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
