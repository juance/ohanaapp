
// Basic types for synchronization
export interface SyncResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
  tickets?: {
    added: number;
    updated: number;
    failed: number;
  };
  expenses?: {
    added: number;
    updated: number;
    failed: number;
  };
  clients?: {
    added: number;
    updated: number;
    failed: number;
  };
  feedback?: {
    added: number;
    updated: number;
    failed: number;
  };
}

export interface SimpleSyncStatus {
  timestamp: string;
  status: 'success' | 'error' | 'in-progress';
  message?: string;
  lastSync?: string;
  syncError?: string | null;
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
}

export interface SyncableItem {
  id: string;
  pendingSync?: boolean;
}

export interface SyncableExpense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  pendingSync?: boolean;
  synced?: boolean; // Added missing property
}

export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  clientName?: string; // Made optional
  phoneNumber?: string; // Made optional
  total: number;
  totalPrice?: number;
  status: string;
  paymentMethod: string;
  date?: string; // Made optional
  isPaid: boolean;
  createdAt: string;
  pendingSync?: boolean;
  customerId?: string;
  deliveredDate?: string;
}
