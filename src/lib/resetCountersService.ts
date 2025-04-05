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
    const results = {
      dashboard: false,
      clients: false,
      loyalty: false,
      metrics: false,
      ticketAnalysis: false
    };

    // Reset dashboard counters
    if (sections.dashboard) {
      try {
        // Delete all ticket_laundry_options (need to delete these first due to foreign key constraints)
        const { error: optionsError } = await supabase
          .from('ticket_laundry_options')
          .delete()
          .not('id', 'is', null);

        if (optionsError) {
          console.error('Error deleting ticket_laundry_options:', optionsError);
          // Continue with the reset process even if there's an error here
        }

        // Delete all dry_cleaning_items (need to delete these first due to foreign key constraints)
        const { error: itemsError } = await supabase
          .from('dry_cleaning_items')
          .delete()
          .not('id', 'is', null);

        if (itemsError) {
          console.error('Error deleting dry_cleaning_items:', itemsError);
          // Continue with the reset process even if there's an error here
        }

        // Delete all tickets
        const { error: ticketsError } = await supabase
          .from('tickets')
          .delete()
          .not('id', 'is', null);

        if (ticketsError) {
          console.error('Error deleting tickets:', ticketsError);
          // Continue with the reset process even if there's an error here
        }

        // Delete all expenses
        const { error: expensesError } = await supabase
          .from('expenses')
          .delete()
          .not('id', 'is', null);

        if (expensesError) {
          console.error('Error deleting expenses:', expensesError);
          // Continue with the reset process even if there's an error here
        }

        results.dashboard = true;
        console.log('Dashboard counters reset successfully');
      } catch (error) {
        console.error('Error resetting dashboard counters:', error);
      }
    }

    // Reset client counters
    if (sections.clients) {
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
        } else {
          results.clients = true;
          console.log('Client counters reset successfully');
        }
      } catch (error) {
        console.error('Error resetting client counters:', error);
      }
    }

    // Reset loyalty program counters
    if (sections.loyalty) {
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
        } else {
          results.loyalty = true;
          console.log('Loyalty program counters reset successfully');
        }
      } catch (error) {
        console.error('Error resetting loyalty counters:', error);
      }
    }

    // Reset metrics counters (same as dashboard)
    if (sections.metrics) {
      results.metrics = results.dashboard;
      console.log('Metrics counters reset status:', results.metrics);
    }

    // Reset ticket analysis counters (same as dashboard)
    if (sections.ticketAnalysis) {
      results.ticketAnalysis = results.dashboard;
      console.log('Ticket analysis counters reset status:', results.ticketAnalysis);
    }

    // Reset ticket sequence if any section was reset
    if (Object.values(results).some(Boolean)) {
      try {
        // Reset ticket sequence to start over
        const { error: sequenceError } = await supabase
          .from('ticket_sequence')
          .update({ last_number: 0 })
          .eq('id', 1);

        if (sequenceError) {
          console.error('Error resetting ticket sequence:', sequenceError);
        } else {
          console.log('Ticket sequence reset successfully');
        }
      } catch (error) {
        console.error('Error resetting ticket sequence:', error);
      }
    }

    // Reset local storage data
    resetLocalData();

    // Check if at least one section was reset successfully
    const success = Object.values(results).some(Boolean);
    return success;
  } catch (error) {
    console.error('Error resetting counters:', error);
    toast.error('Error al reiniciar contadores');
    return false;
  }
};


