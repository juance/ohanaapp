
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

// Add SyncableExpense interface with synced property
export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string; // Make category optional
  pendingSync?: boolean;
  synced?: boolean; // Add this property
}

// Add SyncableCustomerFeedback interface with pendingDelete
export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean; // Add this property
}

// Add LocalClient interface with all required fields
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  clientName?: string;
  phoneNumber?: string;
  valetsCount: number;
  freeValets?: number;
  loyaltyPoints?: number;
  lastVisit?: string;
  pendingSync?: boolean;
}
