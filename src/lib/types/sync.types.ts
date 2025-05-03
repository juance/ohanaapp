
// Types for sync operations

export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync: boolean;
  pendingDelete?: boolean;
  customer_name?: string; // For backward compatibility
  created_at?: string; // For backward compatibility
}

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync: boolean;
  synced?: boolean;
}

export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync: boolean;
}

export interface LocalClient {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  phone: string;
  name: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  lastVisit?: string;
  pendingSync?: boolean;
}

export interface SimpleSyncStatus {
  tickets: number;
  clients: number;
  feedback: number;
  expenses: number;
  lastSync: Date | null;
}
