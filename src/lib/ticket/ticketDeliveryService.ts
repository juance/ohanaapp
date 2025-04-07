
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket } from '../types';
import { getTicketServices } from './ticketServiceCore';
import { buildTicketSelectQuery, mapTicketData } from './ticketQueryUtils';
import { handleError } from '../utils/errorHandling';

// Get tickets that have been delivered
export const getDeliveredTickets = async (): Promise<Ticket[]> => {
  try {
    // Build query with dynamic columns based on whether delivered_date exists
    const selectColumns = await buildTicketSelectQuery(true);
    
    const { data, error } = await supabase
      .from('tickets')
      .select(selectColumns)
      .eq('status', 'delivered')
      .eq('is_canceled', false) // Only show non-canceled tickets
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // Get customer info for each ticket
    const tickets: Ticket[] = [];
    
    // Check if we have valid data
    if (data && Array.isArray(data)) {
      // Check for delivered_date existence for correct mapping later
      const hasDeliveredDateColumn = await buildTicketSelectQuery(true);
      const hasColumn = hasDeliveredDateColumn.includes('delivered_date');
      
      for (const ticketData of data) {
        // Skip invalid ticket data
        if (!ticketData || typeof ticketData !== 'object' || !ticketData.id) {
          console.error('Invalid ticket data received:', ticketData);
          continue;
        }
        
        try {
          // Get customer details
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('name, phone')
            .eq('id', ticketData?.customer_id)
            .single();
          
          if (customerError) {
            console.error('Error fetching customer for ticket:', customerError);
            continue;
          }

          // Add explicit null checks before mapping
          if (ticketData && customerData) {
            // Map ticket data to Ticket model with explicit null check
            const ticketModel = mapTicketData(ticketData, customerData, hasColumn);
            if (ticketModel) {
              tickets.push(ticketModel);
            }
          }
        } catch (err) {
          console.error('Error processing ticket:', err);
          continue;
        }
      }

      // Get services for each ticket
      for (const ticket of tickets) {
        // Since we just created tickets array above, each ticket is guaranteed to exist and have an id
        if (ticket && ticket.id) {
          ticket.services = await getTicketServices(ticket.id);
        }
      }
    }

    return tickets;
  } catch (error) {
    handleError(error, 'getDeliveredTickets', 'Error fetching delivered tickets');
    return [];
  }
};
