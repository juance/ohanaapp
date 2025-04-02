// Re-export all expense-related functions from the modular structure
export {
  addExpense,
  getExpenses,
  getStoredExpenses,
  getDailyExpenses,
  getWeeklyExpenses,
  getMonthlyExpenses
} from './expense';

// Keep backward compatibility for any direct imports
import { addExpense as _addExpense } from './expense/addExpense';
export const storeExpense = _addExpense;
