import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { resetLocalData } from './data/syncService';

/**
 * Reset counters for specific sections of the application
 * This is less destructive than the full data reset and only affects counters
 */
export const resetCounters = async (): Promise<boolean> => {
  try {
    // Reset loyalty points and valets in customers table
    const { error: loyaltyError } = await supabase
      .from('customers')
      .update({
        loyalty_points: 0,
        free_valets: 0,
        valets_count: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null);

    if (loyaltyError) {
      console.error('Error resetting loyalty data:', loyaltyError);
      return false;
    }

    // Reset ticket sequence to start over
    const { error: sequenceError } = await supabase
      .from('ticket_sequence')
      .update({ last_number: 0 })
      .eq('id', 1);

    if (sequenceError) {
      console.error('Error resetting ticket sequence:', sequenceError);
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

/**
 * Reset dashboard counters
 */
export const resetDashboardCounters = async (): Promise<boolean> => {
  try {
    // For dashboard, we need to reset tickets and expenses
    // This will affect the metrics shown in the dashboard
    
    // Delete all tickets
    const { error: ticketsError } = await supabase
      .from('tickets')
      .delete()
      .not('id', 'is', null);

    if (ticketsError) {
      console.error('Error deleting tickets:', ticketsError);
      return false;
    }

    // Delete all expenses
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .not('id', 'is', null);

    if (expensesError) {
      console.error('Error deleting expenses:', expensesError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error resetting dashboard counters:', error);
    toast.error('Error al reiniciar contadores del dashboard');
    return false;
  }
};

/**
 * Reset client-related counters
 */
export const resetClientCounters = async (): Promise<boolean> => {
  try {
    // For clients, we reset visit counts but keep the client records
    const { error } = await supabase
      .from('customers')
      .update({
        last_visit: null
      })
      .not('id', 'is', null);

    if (error) {
      console.error('Error resetting client visit data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error resetting client counters:', error);
    toast.error('Error al reiniciar contadores de clientes');
    return false;
  }
};

/**
 * Reset loyalty program counters
 */
export const resetLoyaltyCounters = async (): Promise<boolean> => {
  try {
    // Reset loyalty points and valets in customers table
    const { error } = await supabase
      .from('customers')
      .update({
        loyalty_points: 0,
        free_valets: 0,
        valets_count: 0,
        valets_redeemed: 0
      })
      .not('id', 'is', null);

    if (error) {
      console.error('Error resetting loyalty data:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error resetting loyalty counters:', error);
    toast.error('Error al reiniciar contadores del programa de fidelidad');
    return false;
  }
};

/**
 * Reset metrics counters
 * This is essentially the same as resetting dashboard counters
 */
export const resetMetricsCounters = async (): Promise<boolean> => {
  return resetDashboardCounters();
};

/**
 * Reset ticket analysis counters
 * This is essentially the same as resetting dashboard counters
 */
export const resetTicketAnalysisCounters = async (): Promise<boolean> => {
  return resetDashboardCounters();
};
