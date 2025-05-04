
// Sync-related types
import { Customer, CustomerFeedback } from '@/lib/types';
import { Ticket } from '@/lib/types/ticket.types';

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
  synced?: boolean;
}

export interface SyncableCustomerFeedback extends CustomerFeedback {
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string; // For compatibility with older code
  clientName?: string; // For compatibility with older code
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
  tickets?: number;
  expenses?: number;
  clients?: number;
  feedback?: number;
  ticketsCount?: number;
  expensesCount?: number;
  clientsCount?: number;
  feedbackCount?: number;
}
