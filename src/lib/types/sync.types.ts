
// Sync-related types
import { Customer, CustomerFeedback, Ticket } from '@/lib/types';

export interface SyncableTicket extends Ticket {
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface SyncableCustomerFeedback extends CustomerFeedback {
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  lastVisit?: string;
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface SimpleSyncStatus {
  lastSync: string | null;
  syncInProgress: boolean;
  syncError: string | null;
}
