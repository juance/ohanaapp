
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
  clientName?: string;
  phoneNumber?: string;
  total: number;
  totalPrice?: number;
  status: string;
  paymentMethod: string;
  date?: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync?: boolean;
  customerId?: string;
  deliveredDate?: string;
}

export interface LocalClient {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  lastVisit?: string;
  pendingSync: boolean;
}

export interface SyncableCustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
}

export interface LocalMetrics {
  daily: {
    salesByHour: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    dryCleaningItems: Record<string, number>;
    totalSales: number;
    valetCount: number;
  };
  weekly: {
    salesByDay: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    totalSales: number;
    valetCount: number;
  };
  monthly: {
    salesByDay: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    totalSales: number;
    valetCount: number;
  };
  pendingSync?: boolean;
}

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
  pending?: boolean;
  lastSync?: string;
}
