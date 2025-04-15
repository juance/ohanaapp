
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

export interface ExpenseServiceInterface {
  storeExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense | null>;
  getStoredExpenses: () => Promise<Expense[]>;
}

export const EXPENSES_STORAGE_KEY = 'expenses';
