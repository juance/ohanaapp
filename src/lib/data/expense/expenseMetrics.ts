
import { getExpenses } from './getExpenses';

// Get expenses for the current day
export const getDailyExpenses = async (): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expenses = await getExpenses(today);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current week
export const getWeeklyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);
  
  const expenses = await getExpenses(startOfWeek);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Get expenses for the current month
export const getMonthlyExpenses = async (): Promise<number> => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const expenses = await getExpenses(startOfMonth);
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};
