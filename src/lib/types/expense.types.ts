
import { ExpenseCategory } from './error.types';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  pendingSync?: boolean;
  synced?: boolean;
  created_at?: string;
}
