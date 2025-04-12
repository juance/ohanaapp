
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { resetLocalData } from './data/syncService';

/**
 * Resets the ticket counter
 */
export const resetTicketCounter = async (): Promise<boolean> => {
  try {
    // Reset on the server
    const { error } = await supabase.rpc('reset_ticket_sequence');
    
    if (error) throw error;
    
    // Also clear any local data
    resetLocalData();
    
    toast({
      title: "Contadores reiniciados",
      description: "Los contadores de tickets han sido reiniciados correctamente"
    });
    
    return true;
  } catch (error) {
    console.error('Error resetting counters:', error);
    
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudieron reiniciar los contadores"
    });
    
    return false;
  }
};
