
// Re-export types from existing module files
export * from './customer.types';
export * from './expense.types';
export * from './ticket.types';
export * from './sync.types';
export * from './inventory.types';
export * from './feedback.types';

// Re-export LaundryOption with a new name to avoid naming conflicts
export { LaundryOption as LaundryServiceOption } from './ticket.types';

// Add LaundryService type
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
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  totalTickets?: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  salesByWeek?: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
  dryCleaningItems?: Record<string, number>;
  totalTickets?: number;
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

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync?: boolean;
}

export interface SyncableCustomerFeedback extends CustomerFeedback {
  pendingSync?: boolean;
}

export interface LocalClient extends Customer {
  clientName?: string;
  phoneNumber?: string;
}
