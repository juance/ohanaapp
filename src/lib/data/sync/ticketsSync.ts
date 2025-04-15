
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types/ticket.types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { TICKETS_STORAGE_KEY } from '@/lib/types/error.types';

export const syncTickets = async (): Promise<number> => {
  try {
    // Get locally stored tickets
    const localTickets = getFromLocalStorage<Ticket[]>(TICKETS_STORAGE_KEY) || [];

    // Check if there are tickets to sync
    const ticketsToSync = localTickets.filter(ticket => ticket.pendingSync);

    if (ticketsToSync.length === 0) {
      console.log('No tickets to sync');
      return 0;
    }

    let syncedCount = 0;

    for (const ticket of ticketsToSync) {
      try {
        // First, check if customer exists
        let customerId: string | null = null;

        if (ticket.phoneNumber) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', ticket.phoneNumber)
            .maybeSingle();

          if (customerData) {
            customerId = customerData.id;
          } else {
            // Create customer if doesn't exist
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                name: ticket.clientName || 'Unknown',
                phone: ticket.phoneNumber,
                valets_count: ticket.valetQuantity || 0
              })
              .select()
              .single();

            if (customerError) {
              console.error('Error creating customer:', customerError);
            } else if (newCustomer) {
              customerId = newCustomer.id;
            }
          }
        }

        // Insert ticket data
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert({
            id: ticket.id,
            ticket_number: ticket.ticketNumber || ticket.ticket_number,
            basket_ticket_number: ticket.basketTicketNumber || ticket.basket_ticket_number,
            total: ticket.totalPrice,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            valet_quantity: ticket.valetQuantity,
            is_paid: ticket.isPaid,
            customer_id: customerId,
            date: ticket.createdAt
          });

        if (ticketError) {
          console.error('Error inserting ticket:', ticketError);
          continue;
        }

        // Handle dry cleaning items
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          const dryCleaningItemsToInsert = ticket.dryCleaningItems.map((item) => ({
            ticket_id: ticket.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          }));

          const { error: dryCleaningError } = await supabase
            .from('dry_cleaning_items')
            .insert(dryCleaningItemsToInsert);

          if (dryCleaningError) {
            console.error('Error inserting dry cleaning items:', dryCleaningError);
          }
        }

        // Handle laundry options
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          const laundryOptionsToInsert = ticket.laundryOptions.map((option) => ({
            ticket_id: ticket.id,
            option_type: option.name
          }));

          const { error: laundryError } = await supabase
            .from('ticket_laundry_options')
            .insert(laundryOptionsToInsert);

          if (laundryError) {
            console.error('Error inserting laundry options:', laundryError);
          }
        }

        // Mark as synced
        const index = localTickets.findIndex(t => t.id === ticket.id);
        if (index !== -1) {
          localTickets[index].pendingSync = false;
        }
        syncedCount++;
      } catch (ticketSyncError) {
        console.error(`Error syncing ticket:`, ticketSyncError);
      }
    }

    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);

    return syncedCount;
  } catch (error) {
    console.error('Error syncing tickets:', error);
    return 0;
  }
};
