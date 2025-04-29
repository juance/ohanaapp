
// Re-export all types
export * from './auth.types';
export * from './customer.types';
export * from './error.types';
// Explicitly re-export to resolve ambiguity
export type { ExpenseCategory } from './expense.types';
export * from './feedback.types';
export * from './inventory.types';
export * from './metrics.types';
export * from './ticket.types';
export * from './sync.types';

// Define the LocalClient interface for use in clientsSync.ts
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsRedeemed: number;
  lastVisit?: string;
  pendingSync?: boolean;
  synced?: boolean;
  // Fields that are used in clientsSync.ts
  phoneNumber?: string;
  clientName?: string;
  valetsCount?: number;
}

// Add the TicketService interface
export interface TicketService {
  id: string;
  name: string;
  quantity?: number;
  price?: number;
  ticketId?: string;
}
