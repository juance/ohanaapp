
export interface SyncStatus {
  online: boolean;
  syncing: boolean;
  error: boolean | string;
  lastSync?: Date | null;
  pending?: number;
  
  // Additional properties for compatibility with existing code
  ticketsSync?: {
    lastSync: Date | null;
    pendingCount: number;
    error: string | null;
  };
  expensesSync?: {
    lastSync: Date | null;
    pendingCount: number;
    error: string | null;
  };
  clientsSync?: {
    lastSync: Date | null;
    pendingCount: number;
    error: string | null;
  };
  feedbackSync?: {
    lastSync: Date | null;
    pendingCount: number;
    error: string | null;
  };
}

export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  pendingSync?: boolean;
  synced?: boolean;
}

export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync?: boolean;
  synced?: boolean;
}

export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
  synced?: boolean;
}

export interface SyncStatusResponse {
  status: string;
  timestamp: string;
  details: {
    online: boolean;
    lastSync: string | null;
    pendingItems: number;
  };
}

export type SyncStats = SyncStatus;
