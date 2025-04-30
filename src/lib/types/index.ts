
// Re-export types from existing module files
export * from './customer.types';
export * from './expense.types';
export * from './ticket.types';
export * from './sync.types';
export * from './inventory.types';
export * from './feedback.types';
export type { LaundryOption } from './ticket.types'; // Re-export as type to fix isolatedModules error

// Add LaundryService type with optionType property
export interface LaundryService {
  id: string;
  name: string;
  optionType: string;
  price?: number;
}

// Export metrics types
export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  totalTickets?: number;
  paidTickets?: number; // Make this optional
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  totalTickets?: number;
  paidTickets?: number; // Make this optional
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  salesByWeek?: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  totalTickets?: number;
  paidTickets?: number; // Make this optional
}

// Export error types
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ErrorContext {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  OTHER = 'other',
}

// Menu types
export interface MenuOption {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface MenuContext {
  expanded: boolean;
  toggleMenu: () => void;
}

// Export expense category
export enum ExpenseTypeCategory {
  SUPPLIES = 'supplies',
  UTILITIES = 'utilities',
  RENT = 'rent',
  SALARIES = 'salaries',
  MARKETING = 'marketing',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}

// Sync-related types for compatibility
export interface SyncableTicket extends Ticket {
  pendingSync?: boolean;
}

// Update SyncableExpense to make category optional since it's causing errors
export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string; // Make this optional
  pendingSync?: boolean;
  synced?: boolean; // Add this property
}

export interface SyncableCustomerFeedback extends CustomerFeedback {
  pendingSync?: boolean;
  pendingDelete?: boolean; // Add this property
}

// Update LocalClient to include all required fields
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  clientName?: string;
  phoneNumber?: string;
  valetsCount: number;
  freeValets?: number; // Add these fields to fix errors
  loyaltyPoints?: number;
  lastVisit?: string;
  pendingSync?: boolean;
}
