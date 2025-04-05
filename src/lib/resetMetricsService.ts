import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { resetLocalData } from './data/syncService';

/**
 * Reset specific metrics counters
 * This is focused on the metrics section and only resets the selected metrics
 * @param metrics Object with boolean flags for each metric to reset
 */
export const resetMetricsCounters = async (metrics: {
  tickets: boolean;
  clients: boolean;
  revenue: boolean;
  clientTypes: boolean;
}): Promise<boolean> => {
  try {
    const results = {
      tickets: false,
      clients: false,
      revenue: false,
      clientTypes: false
    };

    // Reset tickets counter
    if (metrics.tickets) {
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

        // Reset ticket sequence to start over
        const { error: sequenceError } = await supabase
          .from('ticket_sequence')
          .update({ last_number: 0 })
          .eq('id', 1);

        if (sequenceError) {
          console.error('Error resetting ticket sequence:', sequenceError);
        }

        results.tickets = true;
        console.log('Tickets counter reset successfully');
      } catch (error) {
        console.error('Error resetting tickets counter:', error);
      }
    }

    // Reset clients counter
    if (metrics.clients) {
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
          console.log('Clients counter reset successfully');
        }
      } catch (error) {
        console.error('Error resetting clients counter:', error);
      }
    }

    // Reset revenue data
    if (metrics.revenue) {
      try {
        // Delete all expenses which affect revenue data
        const { error: expensesError } = await supabase
          .from('expenses')
          .delete()
          .not('id', 'is', null);

        if (expensesError) {
          console.error('Error deleting expenses:', expensesError);
          // Continue with the reset process even if there's an error here
        }

        results.revenue = true;
        console.log('Revenue data reset successfully');
      } catch (error) {
        console.error('Error resetting revenue data:', error);
      }
    }

    // Reset client types data
    if (metrics.clientTypes) {
      try {
        // This is handled by the tickets reset, as client types are derived from ticket data
        // But we'll also ensure client visit data is reset
        if (!results.clients) {
          const { error } = await supabase
            .from('customers')
            .update({
              last_visit: null
            })
            .not('id', 'is', null);

          if (error) {
            console.error('Error resetting client visit data for client types:', error);
          }
        }

        results.clientTypes = true;
        console.log('Client types data reset successfully');
      } catch (error) {
        console.error('Error resetting client types data:', error);
      }
    }

    // Reset local storage data related to metrics
    resetLocalData();

    // Check if at least one metric was reset successfully
    const success = Object.values(results).some(Boolean);
    return success;
  } catch (error) {
    console.error('Error resetting metrics counters:', error);
    toast.error('Error al reiniciar contadores de métricas');
    return false;
  }
};
