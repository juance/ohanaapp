
import { useState, useEffect } from 'react';
import { getStoredExpenses } from '@/lib/data/expenseService';
import { toast } from '@/lib/toast';

interface UseExpensesDataReturn {
  loading: boolean;
  error: Error | null;
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  refreshData: () => Promise<void>;
}

export const useExpensesData = (): UseExpensesDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [expenses, setExpenses] = useState<{daily: number; weekly: number; monthly: number}>({
    daily: 0,
    weekly: 0,
    monthly: 0
  });
  
  const fetchExpenses = async () => {
    try {
      console.log('Obteniendo datos de gastos...');
      // Obtener todos los gastos almacenados
      const allExpenses = await getStoredExpenses();
      console.log('Gastos obtenidos:', allExpenses.length);
      
      // Obtener fecha actual
      const today = new Date();
      
      // Calcular gastos diarios
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Filtrar gastos del día
      const dailyExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startOfDay && expDate <= endOfDay;
      });
      
      const dailyTotal = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      console.log('Gastos diarios:', dailyTotal);
      
      // Calcular gastos semanales
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Inicio de semana (Domingo)
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Fin de semana (Sábado)
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Filtrar gastos de la semana
      const weeklyExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startOfWeek && expDate <= endOfWeek;
      });
      
      const weeklyTotal = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      console.log('Gastos semanales:', weeklyTotal);
      
      // Calcular gastos mensuales
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      // Filtrar gastos del mes
      const monthlyExpenses = allExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= startOfMonth && expDate <= endOfMonth;
      });
      
      const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      console.log('Gastos mensuales:', monthlyTotal);
      
      setExpenses({
        daily: dailyTotal,
        weekly: weeklyTotal,
        monthly: monthlyTotal
      });
    } catch (err) {
      console.error("Error al obtener gastos:", err);
      setError(err instanceof Error ? err : new Error('Error desconocido al obtener gastos'));
      toast.error("Error al cargar los datos de gastos");
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = async () => {
    setLoading(true);
    await fetchExpenses();
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  return {
    loading,
    error,
    expenses,
    refreshData
  };
};
