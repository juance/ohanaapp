
import { supabase } from '@/integrations/supabase/client';
import { SyncableTicket } from '@/lib/types/sync.types';
import { STORAGE_KEYS } from '@/lib/constants/appConstants';

// Get tickets from local storage
const getLocalTickets = (): SyncableTicket[] => {
  try {
    const ticketsJSON = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return ticketsJSON ? JSON.parse(ticketsJSON) : [];
  } catch (error) {
    console.error('Error getting local tickets:', error);
    return [];
  }
};

// Save tickets to local storage
const saveLocalTickets = (tickets: SyncableTicket[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  } catch (error) {
    console.error('Error saving local tickets:', error);
  }
};

// Sync tickets with the server
export const syncTickets = async (): Promise<number> => {
  try {
    const localTickets = getLocalTickets();
    const pendingTickets = localTickets.filter(ticket => ticket.pendingSync);
    
    if (pendingTickets.length === 0) {
      return 0;
    }
    
    // Process each pending ticket
    const syncPromises = pendingTickets.map(async (ticket) => {
      try {
        // Insert the ticket into Supabase
        const { data, error } = await supabase
          .from('tickets')
          .insert({
            ticket_number: ticket.ticketNumber,
            total: ticket.total || ticket.totalPrice || 0,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            is_paid: ticket.isPaid,
            created_at: ticket.createdAt,
            // Add any other fields needed
          })
          .select();
          
        if (error) throw error;
        
        // Mark this ticket as synced in local storage
        const updatedLocalTickets = localTickets.map(t => {
          if (t.id === ticket.id) {
            return { ...t, pendingSync: false };
          }
          return t;
        });
        
        saveLocalTickets(updatedLocalTickets);
        
        return true;
      } catch (error) {
        console.error('Error syncing ticket:', error, ticket);
        return false;
      }
    });
    
    const results = await Promise.all(syncPromises);
    const syncedCount = results.filter(Boolean).length;
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return 0;
  }
};
