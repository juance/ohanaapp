
// Base ticket interface
export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  total: number;
  isPaid: boolean;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'canceled';
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: string;
  deliveredDate?: string;
  customerId?: string;
  usesFreeValet?: boolean;
}

// Laundry service option
export interface LaundryOption {
  id: string;
  name: string;
  selected: boolean;
}

// Dry cleaning item
export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
