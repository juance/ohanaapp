
import { supabase } from '@/integrations/supabase/client';
import { SyncableTicket } from '@/lib/types/sync.types';
import { TICKETS_STORAGE_KEY } from '@/lib/constants/storageKeys';

// Get tickets from local storage
const getLocalTickets = (): SyncableTicket[] => {
  try {
    const ticketsJSON = localStorage.getItem(TICKETS_STORAGE_KEY);
    return ticketsJSON ? JSON.parse(ticketsJSON) : [];
  } catch (error) {
    console.error('Error getting local tickets:', error);
    return [];
  }
};

// Save tickets to local storage
const saveLocalTickets = (tickets: SyncableTicket[]): void => {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Error saving local tickets:', error);
  }
};

/**
 * Fetches tickets from Supabase that were updated after lastSync
 * @param lastSync Timestamp of last sync
 * @returns Array of tickets from the server
 */
const fetchRemoteTickets = async (lastSync: string | null): Promise<any[]> => {
  try {
    let query = supabase.from('tickets').select(`
      id, 
      ticket_number,
      total,
      payment_method,
      status,
      is_paid,
      created_at,
      updated_at,
      delivered_date,
      customer_id
    `);
    
    // If we have a lastSync date, only get tickets updated since then
    if (lastSync) {
      query = query.gt('updated_at', lastSync);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching remote tickets:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchRemoteTickets:', error);
    return [];
  }
};

/**
 * Maps a server ticket to the local format
 * @param serverTicket Ticket from the server
 * @returns Ticket in local format
 */
const mapServerTicketToLocal = (serverTicket: any): SyncableTicket => {
  return {
    id: serverTicket.id,
    ticketNumber: serverTicket.ticket_number,
    total: serverTicket.total,
    totalPrice: serverTicket.total,
    paymentMethod: serverTicket.payment_method,
    status: serverTicket.status,
    isPaid: serverTicket.is_paid,
    createdAt: serverTicket.created_at,
    pendingSync: false,
    customerId: serverTicket.customer_id,
    deliveredDate: serverTicket.delivered_date,
    date: serverTicket.created_at
  };
};

// Sync tickets with the server
export const syncTickets = async (): Promise<{added: number, updated: number, failed: number}> => {
  try {
    let syncedCount = 0;
    
    // Get local tickets and find ones pending sync
    const localTickets = getLocalTickets();
    const pendingTickets = localTickets.filter(ticket => ticket.pendingSync);
    
    // Get the last sync timestamp from local storage
    const syncStatus = localStorage.getItem('syncStatus');
    const lastSync = syncStatus ? JSON.parse(syncStatus).lastSync : null;
    
    // Get remote tickets that have been updated since last sync
    const remoteTickets = await fetchRemoteTickets(lastSync);
    
    // 1. Upload pending local tickets to the server
    if (pendingTickets.length > 0) {
      for (const ticket of pendingTickets) {
        try {
          // Insert the ticket into Supabase
          const { data, error } = await supabase
            .from('tickets')
            .insert({
              id: ticket.id,
              ticket_number: ticket.ticketNumber,
              total: ticket.total || ticket.totalPrice || 0,
              payment_method: ticket.paymentMethod,
              status: ticket.status,
              is_paid: ticket.isPaid,
              created_at: ticket.createdAt,
              customer_id: ticket.customerId
            })
            .select();
            
          if (error) {
            console.error('Error syncing ticket to server:', error, ticket);
            continue;
          }
          
          syncedCount++;
        } catch (error) {
          console.error('Error syncing ticket:', error, ticket);
        }
      }
    }
    
    // 2. Update local tickets with server data
    if (remoteTickets.length > 0) {
      const updatedLocalTickets = [...localTickets];
      
      for (const remoteTicket of remoteTickets) {
        // Find if this ticket exists locally
        const localIndex = updatedLocalTickets.findIndex(t => t.id === remoteTicket.id);
        
        if (localIndex >= 0) {
          // Update existing local ticket with remote data
          // We don't override pendingSync flag if it's true
          const currentPendingSync = updatedLocalTickets[localIndex].pendingSync;
          updatedLocalTickets[localIndex] = {
            ...mapServerTicketToLocal(remoteTicket),
            pendingSync: currentPendingSync
          };
        } else {
          // Add new remote ticket to local storage
          updatedLocalTickets.push(mapServerTicketToLocal(remoteTicket));
        }
      }
      
      // Save updated tickets to local storage
      saveLocalTickets(updatedLocalTickets);
    }
    
    // 3. Mark synced tickets as no longer pending
    if (syncedCount > 0) {
      const updatedLocalTickets = localTickets.map(ticket => {
        if (ticket.pendingSync) {
          return { ...ticket, pendingSync: false };
        }
        return ticket;
      });
      
      saveLocalTickets(updatedLocalTickets);
    }
    
    return {
      added: syncedCount,
      updated: remoteTickets.length,
      failed: 0
    };
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return {
      added: 0,
      updated: 0,
      failed: 1
    };
  }
};
