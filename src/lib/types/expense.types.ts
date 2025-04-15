
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  created_at?: string;
  pendingSync?: boolean;
  synced?: boolean;
}

export type ExpenseCategory = 
  | 'operations'
  | 'supplies'
  | 'maintenance'
  | 'utilities'
  | 'marketing'
  | 'other';
