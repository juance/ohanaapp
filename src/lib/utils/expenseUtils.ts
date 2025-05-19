
import { Expense } from '../types/expense.types';

/**
 * Convert expense from camelCase to snake_case format
 */
export const toSnakeCase = (expense: Partial<Expense>): Record<string, any> => {
  return {
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    created_at: expense.createdAt || expense.created_at || new Date().toISOString(),
    pending_sync: expense.pendingSync,
    synced: expense.synced
  };
};

/**
 * Convert expense from snake_case to camelCase format
 */
export const toCamelCase = (expense: Record<string, any>): Expense => {
  return {
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    createdAt: expense.created_at,
    pendingSync: expense.pending_sync,
    synced: expense.synced
  };
};
