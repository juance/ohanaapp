
import React, { useState, useEffect } from 'react';
import { Expense } from '@/lib/types/expense.types';
import { getStoredExpenses } from '@/lib/data/expenseService';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpensesHeader } from '@/components/expenses/ExpensesHeader';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses when component mounts or after a new expense is added
  const loadExpenses = async () => {
    const storedExpenses = await getStoredExpenses();
    setExpenses(storedExpenses);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <ExpensesHeader />
      
      <ExpenseForm onExpenseAdded={loadExpenses} />
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de Gastos</h2>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
};

export default Expenses;
