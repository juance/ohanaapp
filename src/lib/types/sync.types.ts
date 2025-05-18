
/**
 * Basic sync status information
 */
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  lastSync: string | null;
  syncError?: string | null;
}

/**
 * Result of a sync operation
 */
export interface SyncResult {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Comprehensive sync options
 */
export interface SyncOptions {
  force?: boolean;
  types?: ('tickets' | 'expenses' | 'clients' | 'feedback')[];
  onProgress?: (progress: number) => void;
}

/**
 * Expense data with sync status
 */
export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  pendingSync: boolean;
  synced?: boolean;
}

/**
 * Customer feedback data with sync status
 */
export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync: boolean;
  pendingDelete?: boolean;
}

/**
 * Ticket data with sync status
 */
export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  total: number;
  totalPrice?: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync: boolean;
  customerId?: string;
  deliveredDate?: string;
  date: string;
  synced?: boolean;
}

/**
 * Client data with sync status
 */
export interface LocalClient {
  id?: string;
  clientId?: string;
  clientName: string;
  name?: string;
  phoneNumber: string;
  phone?: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  lastVisit?: string;
  pendingSync: boolean;
}
