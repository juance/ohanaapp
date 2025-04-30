
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
  // Optional fields for backwards compatibility and extensions
  customerName?: string; // Alias for clientName
  customerPhone?: string; // Alias for phoneNumber
  services?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  basketTicketNumber?: string;
  dryCleaningItems?: any[];
  laundryOptions?: any[];
  customerId?: string;
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
  optionType: string;
  option_type?: string; // For backwards compatibility
  price?: number; // Added price as optional
  ticketId?: string;
  createdAt?: string;
}

export interface TicketService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'dry_cleaning' | 'laundry_option';
}

export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'mercadopago' | 'transfer' | 'cuentaDni';

// Extend with new metrics interface
export interface TicketMetrics {
  totalCount: number;
  pendingCount: number;
  readyCount: number;
  deliveredCount: number;
  totalRevenue: number;
  averageValue: number;
  paidCount: number;
  unpaidCount: number;
}
