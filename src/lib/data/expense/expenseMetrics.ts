
import { getExpenses } from './getExpenses';

// Get expenses for the current day
export const getDailyExpenses = async (): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all expenses and filter by date
  const expenses = await getExpenses();
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= today;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current week
export const getWeeklyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get all expenses and filter by date
  const expenses = await getExpenses();
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfWeek;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current month
export const getMonthlyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Get all expenses and filter by date
  const expenses = await getExpenses();
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};
