
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  pendingSync?: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}
