
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  created_at?: string;
  pendingSync?: boolean;
  synced?: boolean;
  // Removed category field as it doesn't exist in the database
}

export type ExpenseCategory =
  | 'operations'
  | 'supplies'
  | 'maintenance'
  | 'utilities'
  | 'marketing'
  | 'other';
