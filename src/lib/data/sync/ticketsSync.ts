
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, TICKETS_STORAGE_KEY } from '../coreUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Synchronize locally stored tickets with Supabase
 * @returns Number of successfully synced tickets
 */
export const syncTickets = async (): Promise<number> => {
  try {
    // Get locally stored tickets
    const localTickets = getFromLocalStorage(TICKETS_STORAGE_KEY);
    
    // Check if there are tickets to sync
    const ticketsToSync = localTickets.filter(ticket => ticket.pendingSync);
    
    if (ticketsToSync.length === 0) {
      console.log('No tickets to sync');
      return 0;
    }
    
    console.log(`Found ${ticketsToSync.length} tickets to sync`);
    
    // Track successfully synced tickets
    let syncedCount = 0;
    
    // Process each ticket
    for (const ticket of ticketsToSync) {
      try {
        // Find or create customer
        let customerId: string | null = null;
        
        // Check if customer exists by phone
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', ticket.phoneNumber)
          .maybeSingle();
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create customer
          const { data: newCustomer, error: customerError } = await supabase
            .from('customers')
            .insert({
              name: ticket.clientName,
              phone: ticket.phoneNumber
            })
            .select('id')
            .single();
          
          if (customerError) throw customerError;
          customerId = newCustomer.id;
        }
        
        // Create ticket in Supabase
        const { data: createdTicket, error: ticketError } = await supabase
          .from('tickets')
          .insert({
            ticket_number: ticket.ticketNumber,
            customer_id: customerId,
            total: ticket.totalPrice,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            valet_quantity: ticket.valetQuantity,
            is_paid: ticket.isPaid || false,
            date: ticket.createdAt
          })
          .select('id')
          .single();
        
        if (ticketError) throw ticketError;
        
        // Sync dry cleaning items if any
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          const itemsToInsert = ticket.dryCleaningItems.map(item => ({
            ticket_id: createdTicket.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            id: uuidv4()
          }));
          
          const { error: itemsError } = await supabase
            .from('dry_cleaning_items')
            .insert(itemsToInsert);
          
          if (itemsError) {
            console.error('Error syncing dry cleaning items:', itemsError);
          }
        }
        
        // Sync laundry options if any
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          const optionsToInsert = ticket.laundryOptions.map(option => ({
            ticket_id: createdTicket.id,
            option_type: typeof option === 'string' ? option : option.name,
            id: uuidv4()
          }));
          
          const { error: optionsError } = await supabase
            .from('ticket_laundry_options')
            .insert(optionsToInsert);
          
          if (optionsError) {
            console.error('Error syncing laundry options:', optionsError);
          }
        }
        
        // Mark as synced in local storage
        ticket.pendingSync = false;
        syncedCount++;
      } catch (ticketSyncError) {
        console.error(`Error syncing ticket ${ticket.ticketNumber}:`, ticketSyncError);
      }
    }
    
    // Update local storage with synced status
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(localTickets));
    
    console.log(`Successfully synced ${syncedCount} out of ${ticketsToSync.length} tickets`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing tickets:', error);
    return 0;
  }
};
