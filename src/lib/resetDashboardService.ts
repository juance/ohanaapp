import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { resetLocalData } from './data/syncService';

/**
 * Reset specific dashboard counters
 * This is focused on the dashboard section and only resets the selected counters
 * @param counters Object with boolean flags for each counter to reset
 */
export const resetDashboardCounters = async (counters: {
  tickets: boolean;
  paidTickets: boolean;
  revenue: boolean;
  expenses: boolean;
  freeValets: boolean;
}): Promise<boolean> => {
  try {
    const results = {
      tickets: false,
      paidTickets: false,
      revenue: false,
      expenses: false,
      freeValets: false
    };

    // Reset tickets counter
    if (counters.tickets) {
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

    // Reset paid tickets counter
    if (counters.paidTickets) {
      try {
        // If tickets are already reset, we don't need to do anything extra
        if (results.tickets) {
          results.paidTickets = true;
        } else {
          // Update all tickets to be unpaid
          const { error } = await supabase
            .from('tickets')
            .update({
              payment_status: 'pending',
              payment_method: null,
              payment_amount: 0
            })
            .not('id', 'is', null);

          if (error) {
            console.error('Error resetting paid tickets status:', error);
          } else {
            results.paidTickets = true;
            console.log('Paid tickets counter reset successfully');
          }
        }
      } catch (error) {
        console.error('Error resetting paid tickets counter:', error);
      }
    }

    // Reset revenue data
    if (counters.revenue) {
      try {
        // If tickets are already reset, we don't need to do anything extra for revenue
        if (results.tickets) {
          results.revenue = true;
        } else {
          // Update all tickets to have zero revenue
          const { error } = await supabase
            .from('tickets')
            .update({
              total_amount: 0,
              payment_amount: 0
            })
            .not('id', 'is', null);

          if (error) {
            console.error('Error resetting revenue data:', error);
          } else {
            results.revenue = true;
            console.log('Revenue data reset successfully');
          }
        }
      } catch (error) {
        console.error('Error resetting revenue data:', error);
      }
    }

    // Reset expenses data
    if (counters.expenses) {
      try {
        // Delete all expenses
        const { error: expensesError } = await supabase
          .from('expenses')
          .delete()
          .not('id', 'is', null);

        if (expensesError) {
          console.error('Error deleting expenses:', expensesError);
        } else {
          results.expenses = true;
          console.log('Expenses data reset successfully');
        }
      } catch (error) {
        console.error('Error resetting expenses data:', error);
      }
    }

    // Reset free valets counter
    if (counters.freeValets) {
      try {
        // Reset free valets in customers table
        const { error } = await supabase
          .from('customers')
          .update({
            free_valets: 0,
            valets_count: 0,
            valets_redeemed: 0
          })
          .not('id', 'is', null);

        if (error) {
          console.error('Error resetting free valets data:', error);
        } else {
          results.freeValets = true;
          console.log('Free valets counter reset successfully');
        }
      } catch (error) {
        console.error('Error resetting free valets counter:', error);
      }
    }

    // Reset local storage data related to dashboard
    resetLocalData();

    // Check if at least one counter was reset successfully
    const success = Object.values(results).some(Boolean);
    return success;
  } catch (error) {
    console.error('Error resetting dashboard counters:', error);
    toast.error('Error al reiniciar contadores del dashboard');
    return false;
  }
};
