
// Define the expense type

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  pendingSync?: boolean;
  synced?: boolean;
}
