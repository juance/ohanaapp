
export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  valetQuantity: number;
  createdAt: string;
  deliveredDate: string | null;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface LaundryOption {
  id: string;
  name: string;
  option_type: string;
}

export interface TicketService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'dry_cleaning' | 'laundry_option';
}

export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'transfer' | 'cuentaDni';
