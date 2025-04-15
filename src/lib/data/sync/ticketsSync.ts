
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY } from '../coreUtils';

/**
 * Syncs ticket data with the Supabase backend
 * @returns The number of tickets synced
 */
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
            .eq('phone_number', ticket.phoneNumber)
            .maybeSingle();
          
          if (customerData) {
            customerId = customerData.id;
          } else {
            // Create customer if doesn't exist
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                name: ticket.clientName || 'Unknown',
                phone_number: ticket.phoneNumber,
                valet_count: ticket.valetQuantity || 0
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
            ticket_number: ticket.ticketNumber,
            basket_ticket_number: ticket.basketTicketNumber,
            total_price: ticket.totalPrice,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            valet_quantity: ticket.valetQuantity,
            is_paid: ticket.isPaid,
            customer_id: customerId,
            created_at: ticket.createdAt,
            due_date: ticket.createdAt // Replace with actual due date when available
          });
        
        if (ticketError) {
          console.error('Error inserting ticket:', ticketError);
          continue;
        }
        
        // Handle dry cleaning items if any
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          const dryCleaningItemsToInsert = ticket.dryCleaningItems.map((item: DryCleaningItem) => ({
            ticket_id: ticket.id,
            item_type: item.itemType,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
          }));
          
          const { error: dryCleaningError } = await supabase
            .from('dry_cleaning_items')
            .insert(dryCleaningItemsToInsert);
          
          if (dryCleaningError) {
            console.error('Error inserting dry cleaning items:', dryCleaningError);
          }
        }
        
        // Handle laundry options if any
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          const laundryOptionsToInsert = ticket.laundryOptions.map((option: LaundryOption) => ({
            ticket_id: ticket.id,
            service_type: option.serviceType,
            weight: option.weight,
            price: option.price
          }));
          
          const { error: laundryError } = await supabase
            .from('ticket_laundry_options')
            .insert(laundryOptionsToInsert);
          
          if (laundryError) {
            console.error('Error inserting laundry options:', laundryError);
          }
        }
        
        // Mark as synced
        ticket.pendingSync = false;
        syncedCount++;
        
        console.log(`Synced ticket ${ticket.ticketNumber} successfully`);
      } catch (ticketSyncError) {
        console.error(`Error syncing ticket:`, ticketSyncError);
      }
    }
    
    // Save updated tickets to local storage
    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return 0;
  }
};
