
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

interface DashboardStats {
  totalTickets: number;
  ticketsToday: number;
  pendingTickets: number;
  dailyRevenue: number;
  totalRevenue: number;
  monthlyRevenue: number;
  completedTickets: number;
  topServices: any[];
}

interface DateFilter {
  startDate: Date;
  endDate: Date;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>({
    metrics: {},
    expenses: {},
    chartData: [],
    clients: []
  });
  
  // Añadimos estado para las fechas de filtrado
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Por defecto, último mes
    endDate: new Date()
  });

  const fetchDashboardData = async (startDate?: Date, endDate?: Date) => {
    setLoading(true);
    try {
      // Utilizar las fechas proporcionadas o las del estado
      const filterStartDate = startDate || dateFilter.startDate;
      const filterEndDate = endDate || dateFilter.endDate;

      // Convertir fechas a formato ISO para consultas
      const startDateISO = filterStartDate.toISOString();
      const endDateISO = filterEndDate.toISOString();
      
      // Get statistics directly from the tickets and other tables
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);
      
      if (ticketsError) throw ticketsError;
      
      // Process the data to calculate statistics
      const totalTickets = ticketsData ? ticketsData.length : 0;
      const today = new Date().toISOString().split('T')[0];
      const ticketsToday = ticketsData ? ticketsData.filter(t => 
        t.created_at && t.created_at.startsWith(today)
      ).length : 0;
      
      const pendingTickets = ticketsData ? ticketsData.filter(t => 
        t.status === 'pending' || t.status === 'processing'
      ).length : 0;
      
      const completedTickets = ticketsData ? ticketsData.filter(t => 
        t.status === 'delivered'
      ).length : 0;
      
      let totalRevenue = 0;
      let dailyRevenue = 0;
      let monthlyRevenue = 0;
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      if (ticketsData && ticketsData.length > 0) {
        ticketsData.forEach(ticket => {
          if (ticket.is_paid) {
            totalRevenue += Number(ticket.total || 0);
            
            const ticketDate = new Date(ticket.created_at);
            if (ticketDate.toISOString().split('T')[0] === today) {
              dailyRevenue += Number(ticket.total || 0);
            }
            
            if (ticketDate.getMonth() + 1 === currentMonth && 
                ticketDate.getFullYear() === currentYear) {
              monthlyRevenue += Number(ticket.total || 0);
            }
          }
        });
      }
      
      // Get expenses data filtered by date
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDateISO)
        .lte('date', endDateISO);
        
      if (expensesError) throw expensesError;
      
      let totalExpenses = 0;
      let dailyExpenses = 0;
      let monthlyExpenses = 0;
      
      if (expensesData && expensesData.length > 0) {
        expensesData.forEach(expense => {
          totalExpenses += Number(expense.amount || 0);
          
          const expenseDate = new Date(expense.date);
          if (expenseDate.toISOString().split('T')[0] === today) {
            dailyExpenses += Number(expense.amount || 0);
          }
          
          if (expenseDate.getMonth() + 1 === currentMonth && 
              expenseDate.getFullYear() === currentYear) {
            monthlyExpenses += Number(expense.amount || 0);
          }
        });
      }
      
      // Get frequent clients data
      const { data: clientsData, error: clientsError } = await supabase
        .from('customers')
        .select('*')
        .order('valets_count', { ascending: false })
        .limit(10);
        
      if (clientsError) throw clientsError;
      
      // Create chart data
      const chartData = generateChartData(ticketsData || [], expensesData || []);
      
      // Calculate top services (simplified)
      const topServices = []; // This would require more detailed analysis of services
      
      const dashboardStats: DashboardStats = {
        totalTickets,
        ticketsToday,
        pendingTickets,
        dailyRevenue,
        totalRevenue,
        monthlyRevenue,
        completedTickets,
        topServices
      };
      
      setStats(dashboardStats);
      setData({
        metrics: {
          total: totalTickets,
          delivered: completedTickets,
          pending: pendingTickets,
          revenue: totalRevenue,
          valetCount: ticketsData?.reduce((acc, ticket) => acc + (ticket.valet_quantity || 0), 0) || 0,
          dryCleaningItemsCount: 0 // Would need to query dry cleaning items
        },
        expenses: {
          daily: dailyExpenses,
          weekly: 0, // Would need to calculate
          monthly: monthlyExpenses,
          total: totalExpenses
        },
        chartData,
        clients: clientsData || []
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error al cargar datos del dashboard");
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para actualizar el filtro de fechas
  const updateDateFilter = (startDate: Date, endDate: Date) => {
    setDateFilter({ startDate, endDate });
    fetchDashboardData(startDate, endDate);
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  return { 
    stats, 
    loading, 
    isLoading: loading,
    error,
    data,
    dateFilter,
    updateDateFilter,
    refreshData: fetchDashboardData 
  };
};

// Helper function to generate chart data
const generateChartData = (tickets: any[], expenses: any[]) => {
  const today = new Date();
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const data = [];
  
  // Generate data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Filter tickets for this date
    const dayTickets = tickets.filter(ticket => 
      ticket.created_at && ticket.created_at.startsWith(dateString)
    );
    
    // Filter expenses for this date
    const dayExpenses = expenses.filter(expense => 
      expense.date && expense.date.startsWith(dateString)
    );
    
    // Calculate totals
    const revenue = dayTickets.reduce((sum, ticket) => sum + Number(ticket.total || 0), 0);
    const expense = dayExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    
    data.push({
      name: daysOfWeek[date.getDay()],
      ingresos: revenue,
      gastos: expense,
      beneficio: revenue - expense
    });
  }
  
  return data;
};
