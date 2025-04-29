
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

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get statistics directly from the tickets and other tables
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*');
      
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refreshData: fetchDashboardData };
};
