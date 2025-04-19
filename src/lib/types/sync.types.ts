export interface SyncStatus {
  ticketsSync: {
    lastSync: string | null;
    pendingCount: number;
    error: string | null;
  };
  expensesSync: {
    lastSync: string | null;
    pendingCount: number;
    error: string | null;
  };
  clientsSync: {
    lastSync: string | null;
    pendingCount: number;
    error: string | null;
  };
  feedbackSync: {
    lastSync: string | null;
    pendingCount: number;
    error: string | null;
  };
}

// Add a new simplified sync status interface for use in components
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}

export interface SyncStats {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  inventory: number;
}

export interface SyncStatusResponse {
  pending: SyncStats;
  lastSync: string | null;
}

export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync: boolean;
  synced?: boolean;
}

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  pendingSync?: boolean;
  synced?: boolean;
}

export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: 'client_portal' | 'admin';
  pendingSync?: boolean;
  pendingDelete?: boolean;
  synced?: boolean;
}
