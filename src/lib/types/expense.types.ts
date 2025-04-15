
export type ExpenseCategory = 'supplies' | 'utilities' | 'rent' | 'salaries' | 'other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  createdAt?: string;
  pendingSync?: boolean;
  synced?: boolean;
}
