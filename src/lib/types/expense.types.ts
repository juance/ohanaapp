
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  created_at?: string;
  pendingSync?: boolean;
  synced?: boolean;
  category?: string; // Make category optional to match usage
}

export type ExpenseCategory =
  | 'operations'
  | 'supplies'
  | 'maintenance'
  | 'utilities'
  | 'marketing'
  | 'other';
