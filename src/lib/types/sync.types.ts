
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}

export interface SyncableTicket {
  id: string;
  ticket_number: string;
  total: number;
  payment_method: string;
  status: string;
  is_paid: boolean;
  valet_quantity?: number;
  created_at?: string;
  synced?: boolean;
  pendingSync?: boolean;
  ticketNumber?: string; // Alias for backwards compatibility
  totalPrice?: number; // Alias for backwards compatibility
  paymentMethod?: string; // Alias for backwards compatibility
  isPaid?: boolean; // Alias for backwards compatibility
  createdAt?: string; // Alias for backwards compatibility
}

export interface SyncableCustomerFeedback {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at?: string;
  customerName?: string; // Alias for backwards compatibility
  createdAt?: string; // Alias for backwards compatibility
  source?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface SyncableExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  created_at?: string;
  synced?: boolean;
  pendingSync?: boolean;
  createdAt?: string; // Alias for backwards compatibility
  lastUpdated?: string; // Added for tracking sync status
}

export interface SyncableClient {
  id: string;
  name: string;
  phone: string;
  valets_count?: number;
  free_valets?: number;
  last_visit?: string;
  pendingSync?: boolean;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  phoneNumber: string; // Added for compatibility
  clientName: string; // Added for compatibility
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  valetsRedeemed: number;
  lastVisit?: string;
  pendingSync?: boolean;
  synced?: boolean;
}
