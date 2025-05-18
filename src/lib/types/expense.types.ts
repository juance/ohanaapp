
/**
 * Represents an expense entry
 */
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

/**
 * Standard expense categories
 */
export type ExpenseCategory = 'utilities' | 'rent' | 'supplies' | 'salary' | 'marketing' | 'maintenance' | 'other';
