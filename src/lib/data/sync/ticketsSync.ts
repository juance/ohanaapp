
// We need to implement this file fully to fix the type errors 
// and maintain compatibility with existing code.

import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';

const TICKETS_STORAGE_KEY = 'local_tickets';

export const syncTickets = async (): Promise<number> => {
  try {
    // Get locally stored tickets
    const localTickets = getFromLocalStorage<Ticket[]>(TICKETS_STORAGE_KEY) || [];
    
    // Filter tickets that need to be synced
    const ticketsToSync = localTickets.filter(ticket => ticket.pendingSync);
    
    if (ticketsToSync.length === 0) {
      console.log('No tickets to sync');
      return 0;
    }
    
    let syncedCount = 0;
    const syncErrors: string[] = [];
    
    for (const ticket of ticketsToSync) {
      try {
        // Step 1: Check if a customer exists with this phone number
        let customerId = null;
        if (ticket.phoneNumber) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', ticket.phoneNumber)
            .maybeSingle();
            
          if (customerData) {
            customerId = customerData.id;
          } else {
            // Create a new customer record
            const { data: newCustomer, error: customerError } = await supabase
              .from('customers')
              .insert({
                name: ticket.clientName,
                phone: ticket.phoneNumber,
                valets_count: ticket.valetQuantity || 0,
                last_visit: new Date().toISOString()
              })
              .select('id')
              .single();
              
            if (customerError) {
              console.error('Error creating customer:', customerError);
            } else {
              customerId = newCustomer.id;
            }
          }
        }
        
        // Step 2: Insert the ticket
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .insert({
            ticket_number: ticket.ticketNumber,
            basket_ticket_number: ticket.basketTicketNumber,
            total: ticket.totalPrice,
            payment_method: ticket.paymentMethod,
            status: ticket.status,
            valet_quantity: ticket.valetQuantity,
            is_paid: ticket.isPaid,
            customer_id: customerId,
            created_at: ticket.createdAt,
            date: ticket.createdAt
          })
          .select('id')
          .single();
          
        if (ticketError) {
          throw ticketError;
        }
        
        // Step 3: Insert dry cleaning items if any
        if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
          for (const item of ticket.dryCleaningItems) {
            const { error: dryCleaningError } = await supabase
              .from('dry_cleaning_items')
              .insert({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                ticket_id: ticketData.id
              });
              
            if (dryCleaningError) {
              console.error('Error inserting dry cleaning item:', dryCleaningError);
            }
          }
        }
        
        // Step 4: Insert laundry options if any
        if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
          for (const option of ticket.laundryOptions) {
            const { error: optionError } = await supabase
              .from('ticket_laundry_options')
              .insert({
                option_type: option.name,
                ticket_id: ticketData.id
              });
              
            if (optionError) {
              console.error('Error inserting laundry option:', optionError);
            }
          }
        }
        
        // Mark ticket as synced
        ticket.pendingSync = false;
        syncedCount++;
        
      } catch (error) {
        syncErrors.push(`Ticket ${ticket.ticketNumber}: ${error.message || 'Unknown error'}`);
        console.error('Error syncing ticket:', error);
      }
    }
    
    // Save updated tickets back to local storage
    saveToLocalStorage(TICKETS_STORAGE_KEY, localTickets);
    
    if (syncErrors.length > 0) {
      console.error('Sync errors:', syncErrors);
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return 0;
  }
};
