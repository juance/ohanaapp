import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { resetLocalData } from './data/syncService';

/**
 * Reset counters for specific sections of the application
 * This is less destructive than the full data reset and only affects counters
 * @param sections Object with boolean flags for each section to reset
 */
export const resetCounters = async (sections: {
  dashboard: boolean;
  clients: boolean;
  loyalty: boolean;
  metrics: boolean;
  ticketAnalysis: boolean;
}): Promise<boolean> => {
  try {
    // Call the Supabase edge function to reset counters
    const { data, error } = await supabase.functions.invoke('reset_counters', {
      body: { sections }
    });

    if (error) {
      console.error('Error calling reset_counters function:', error);
      toast.error('Error al reiniciar contadores');
      return false;
    }

    if (!data.success) {
      console.error('Reset counters function failed:', data.error);
      toast.error('Error al reiniciar contadores');
      return false;
    }

    // Reset local storage data
    resetLocalData();

    return true;
  } catch (error) {
    console.error('Error resetting counters:', error);
    toast.error('Error al reiniciar contadores');
    return false;
  }
};


