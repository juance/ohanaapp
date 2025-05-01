
// Expense types

export interface SyncableExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync: boolean;
  synced?: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}
