
// Define the expense type

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  createdAt?: string;
  created_at?: string; // For compatibility with database format
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
