
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  lastSync: string;
}

export interface SyncMetrics {
  totalSynced: number;
  lastSyncTime: string;
  byEntityType: {
    tickets: number;
    clients: number;
    expenses: number;
    feedback: number;
  };
}

export interface SyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
  pending?: boolean;
  lastSync?: string;
  pendingSyncCount?: number;
  lastSyncedAt?: Date;
}

// Add SyncableTicket interface
export interface SyncableTicket {
  id: string;
  pendingSync?: boolean;
  [key: string]: any; // Allow additional properties
}

// Add SyncableExpense interface
export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync?: boolean;
}

// Add SyncableCustomerFeedback interface
export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
}

// Add LocalClient interface for backward compatibility
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  clientName?: string;
  phoneNumber?: string;
  valetsCount: number;
}
