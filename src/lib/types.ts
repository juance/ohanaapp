
// Base ticket interface
export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  total: number;
  totalPrice: number;
  isPaid: boolean;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'canceled' | string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'debit' | 'mercadopago' | 'cuentaDni' | string;
  createdAt: string;
  deliveredDate?: string;
  customerId?: string;
  usesFreeValet?: boolean;
  basketTicketNumber?: string;
  dryCleaningItems?: DryCleaningItem[];
  services?: TicketService[];
}

// Laundry service option
export interface LaundryOption {
  id: string;
  name: string;
  selected: boolean;
  optionType?: string;
}

// Dry cleaning item
export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Ticket service
export interface TicketService {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}
