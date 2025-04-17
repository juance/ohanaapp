
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
  createdAt?: string;
  pendingSync?: boolean;
  synced?: boolean;
}
