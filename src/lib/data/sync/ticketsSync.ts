
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';

const TICKETS_STORAGE_KEY = 'tickets';

/**
 * Synchronize locally stored tickets with Supabase
 * @returns Number of successfully synced tickets
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
    
    console.log(`Found ${ticketsToSync.length} tickets to sync`);
    
    // Track successfully synced tickets
    let syncedCount = 0;
    
    // Process each ticket
    for (const ticket of ticketsToSync) {
      try {
        // First try to get or create customer
        let customerId: string | null = null;
        
        if (ticket.phoneNumber) {
          // Check if customer exists
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', ticket.phoneNumber)
            .maybeSingle();
            
          if (existingCustomer) {
            customerId = existingCustomer.id;
          } else {
            // Create new customer
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                name: ticket.clientName,
                phone: ticket.phoneNumber,
                valets_count: ticket.valetQuantity || 0,
                free_valets: 0
              })
              .select('id')
              .single();
              
            if (customerError) throw customerError;
            customerId = newCustomer.id;
          }
        }
        
        // Create ticket in Supabase
        const { data: createdTicket, error: ticketError } = await supabase
          .from('tickets')
          .insert({
            ticket_number: ticket.ticketNumber,
            basket_ticket_number: ticket.basketTicketNumber,
            total: ticket.totalPrice,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            valet_quantity: ticket.valetQuantity || 0,
            is_paid: ticket.isPaid || false,
            customer_id: customerId,
            created_at: ticket.createdAt
          })
          .select('id')
          .single();
          
        if (ticketError) throw ticketError;
        
        // Add dry cleaning items if any
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          for (const item of ticket.dryCleaningItems) {
            await supabase
              .from('dry_cleaning_items')
              .insert({
                ticket_id: createdTicket.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              });
          }
        }
        
        // Add laundry options if any
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          for (const option of ticket.laundryOptions) {
            await supabase
              .from('ticket_laundry_options')
              .insert({
                ticket_id: createdTicket.id,
                option_type: option.name
              });
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
    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    
    console.log(`Successfully synced ${syncedCount} out of ${ticketsToSync.length} tickets`);
    return syncedCount;
  } catch (error) {
    console.error('Error syncing tickets:', error);
    return 0;
  }
};
