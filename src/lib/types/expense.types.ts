
// Define the expense type

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  createdAt?: string;
  pendingSync?: boolean;
  synced?: boolean;
}

export type ExpenseCategory = 
  | 'rent'
  | 'utilities'
  | 'supplies'
  | 'equipment'
  | 'maintenance'
  | 'marketing'
  | 'salaries'
  | 'taxes'
  | 'insurance'
  | 'other';
