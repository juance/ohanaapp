
export interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  created_at?: string;
}

export type ExpenseCategory = 
  | 'utilities'
  | 'rent'
  | 'supplies'
  | 'maintenance'
  | 'equipment'
  | 'marketing'
  | 'salaries'
  | 'other';
