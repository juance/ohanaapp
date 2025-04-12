
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { resetLocalData } from './data/syncService';

/**
 * Resets the dashboard data
 */
export const resetDashboardData = async (): Promise<boolean> => {
  try {
    // Delete all dashboard stats from the server
    const { error } = await supabase
      .from('dashboard_stats')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except placeholder
    
    if (error) throw error;
    
    // Also clear any local data
    resetLocalData();
    
    toast({
      title: "Dashboard reiniciado",
      description: "Los datos del dashboard han sido reiniciados correctamente"
    });
    
    return true;
  } catch (error) {
    console.error('Error resetting dashboard:', error);
    
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudo reiniciar el dashboard"
    });
    
    return false;
  }
};
