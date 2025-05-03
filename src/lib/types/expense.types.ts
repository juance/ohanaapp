
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export type ExpenseCategory = 'supplies' | 'services' | 'maintenance' | 'other';
