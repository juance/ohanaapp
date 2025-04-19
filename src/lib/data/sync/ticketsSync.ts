
import { supabase } from '@/integrations/supabase/client';
import { SyncableTicket } from '@/lib/types/sync.types';

// Function to sync tickets with the server
export const syncTickets = async (tickets: SyncableTicket[] = []): Promise<number> => {
  try {
    let syncedCount = 0;
    
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return 0;
    }
    
    // Filter tickets that need to be synced
    const ticketsToSync = tickets.filter(ticket => ticket.pendingSync);
    
    if (ticketsToSync.length === 0) {
      return 0;
    }
    
    // Process each ticket
    for (const ticket of ticketsToSync) {
      // Create ticket in Supabase
      const { error } = await supabase
        .from('tickets')
        .insert({
          id: ticket.id,
          ticket_number: ticket.ticketNumber,
          total: ticket.totalPrice,
          payment_method: ticket.paymentMethod,
          status: ticket.status,
          is_paid: ticket.isPaid,
          created_at: ticket.createdAt
        });
        
      if (error) {
        console.error('Error syncing ticket:', error);
        continue;
      }
      
      syncedCount++;
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return 0;
  }
};
