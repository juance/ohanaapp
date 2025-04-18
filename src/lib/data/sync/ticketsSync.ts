
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { TICKETS_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { createClient } from '@/lib/data/customer/customerStorageService';

// Define SyncableTicket type
export interface SyncableTicket extends Ticket {
  pendingSync?: boolean;
  synced?: boolean;
}

export const syncTickets = async (): Promise<number> => {
  try {
    // Get locally stored tickets
    const localTickets = getFromLocalStorage<SyncableTicket[]>(TICKETS_STORAGE_KEY) || [];

    // Check if there are tickets to sync
    const ticketsToSync = localTickets.filter(ticket => ticket.pendingSync);

    if (ticketsToSync.length === 0) {
      console.log('No tickets to sync');
      return 0;
    }

    let syncedCount = 0;

    for (const ticket of ticketsToSync) {
      try {
        // First, try to create client if not exists
        if (ticket.phoneNumber) {
          const clientData = {
            name: ticket.clientName,
            phone: ticket.phoneNumber,
          };

          // It's ok if this fails - client might already exist
          try {
            await createClient(clientData.name, clientData.phone);
          } catch (clientError) {
            console.warn(`Client may already exist for ${ticket.phoneNumber}:`, clientError);
          }
        }

        // Now create the ticket
        const ticketData = {
          id: ticket.id,
          ticket_number: ticket.ticketNumber,
          basket_ticket_number: ticket.basketTicketNumber,
          total_price: ticket.totalPrice,
          payment_method: ticket.paymentMethod,
          status: ticket.status,
          valet_quantity: ticket.valetQuantity,
          is_paid: ticket.isPaid,
          client_id: null, // Will be set by trigger if client exists
          created_at: ticket.createdAt,
          client_name: ticket.clientName,
          client_phone: ticket.phoneNumber
        };

        const { error } = await supabase
          .from('tickets')
          .insert(ticketData);

        if (error) throw error;

        // Now add dry cleaning items if any
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          for (const item of ticket.dryCleaningItems) {
            const { error: itemError } = await supabase
              .from('ticket_items')
              .insert({
                ticket_id: ticket.id,
                item_name: item.name,
                quantity: item.quantity,
                price: item.price
              });

            if (itemError) console.error(`Error syncing item for ticket ${ticket.id}:`, itemError);
          }
        }

        // Now add laundry options if any
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          for (const option of ticket.laundryOptions) {
            const { error: optionError } = await supabase
              .from('ticket_options')
              .insert({
                ticket_id: ticket.id,
                option_name: option.name,
                option_value: option.value
              });

            if (optionError) console.error(`Error syncing option for ticket ${ticket.id}:`, optionError);
          }
        }

        // Update local state
        const index = localTickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
          localTickets[index].pendingSync = false;
          localTickets[index].synced = true;
        }
        syncedCount++;
      } catch (ticketSyncError) {
        console.error(`Error syncing ticket ${ticket.id}:`, ticketSyncError);
      }
    }

    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing tickets:', error);
    return 0;
  }
};
