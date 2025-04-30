
// Re-export types from various module files
export * from './app.types';
export * from './customer.types';
export * from './expense.types';
export * from './ticket.types';

// Carefully re-export specific types to avoid ambiguity
import { ErrorLevel, ErrorContext } from './error.types';
export { ErrorLevel, ErrorContext };

import { MenuOption, MenuContext } from './error.types';
export { MenuOption, MenuContext };

// Rename to avoid naming conflicts
import { ExpenseCategory as ExpenseTypeCategory } from './error.types';
export { ExpenseTypeCategory };

// Rename to avoid naming conflicts
import { LaundryOption as LaundryServiceOption } from './laundry.types';
export { LaundryServiceOption };

// Export sync types
export * from './sync.types';
export * from './inventory.types';
export * from './feedback.types';

// Export metrics types
export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: Record<string, number>;
  totalSales: number;
  valetCount: number;
}

// Add LaundryService type
export interface LaundryService {
  id: string;
  name: string;
  optionType: string;
  price?: number;
}
