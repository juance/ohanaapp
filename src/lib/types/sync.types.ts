
// Basic types for synchronization
export interface SyncResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
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
}

export interface SyncableTicket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  date: string;
  isPaid: boolean;
  createdAt: string;
  pendingSync?: boolean;
}
