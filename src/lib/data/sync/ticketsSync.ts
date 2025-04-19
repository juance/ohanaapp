
import { supabase } from '@/integrations/supabase/client';
import { SyncableTicket } from '@/lib/types';

// Function to sync tickets with the server
export const syncTickets = async (tickets: SyncableTicket[]): Promise<number> => {
  try {
    let syncedCount = 0;
    
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return 0;
    }
    
    // Filter tickets that need to be synced
    const ticketsToSync = tickets.filter(ticket => ticket.pendingSync);
    
    if (ticketsToSync.length === 0) {
      return 0;
    }
    
    // Process each ticket for syncing
    for (const ticket of ticketsToSync) {
      let customerId = ticket.customerId;
      
      // If there's no customer ID but there is a phone number, find or create the customer
      if (!customerId && ticket.phoneNumber) {
        const { data: customers, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', ticket.phoneNumber)
          .limit(1);
        
        if (customerError) {
          console.error('Error finding customer:', customerError);
          continue;
        }
        
        if (customers && customers.length > 0) {
          customerId = customers[0].id;
        } else {
          // Create a new customer
          const { data: newCustomer, error: createError } = await supabase
            .from('customers')
            .insert({
              phone: ticket.phoneNumber,
              name: ticket.clientName || 'Cliente sin nombre',
              loyalty_points: 0,
              free_valets: 0
            })
            .select('id');
          
          if (createError || !newCustomer || newCustomer.length === 0) {
            console.error('Error creating customer:', createError);
            continue;
          }
          
          customerId = newCustomer[0].id;
        }
      }
      
      // Create ticket in Supabase
      const { data: createdTicket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ticket_number: ticket.ticketNumber,
          customer_id: customerId,
          total: ticket.total,
          status: ticket.status,
          payment_method: ticket.paymentMethod,
          valet_quantity: ticket.valetQuantity,
          date: ticket.date,
          is_paid: ticket.isPaid,
          payment_status: ticket.paymentStatus
        })
        .select('id');
      
      if (ticketError || !createdTicket || createdTicket.length === 0) {
        console.error('Error creating ticket:', ticketError);
        continue;
      }
      
      const ticketId = createdTicket[0].id;
      
      // If there are dry cleaning items, add them
      if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
        for (const item of ticket.dryCleaningItems) {
          const { error: itemError } = await supabase
            .from('dry_cleaning_items')
            .insert({
              ticket_id: ticketId,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            });
          
          if (itemError) {
            console.error('Error creating dry cleaning item:', itemError);
          }
        }
      }
      
      // If there are laundry options, add them
      if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
        for (const option of ticket.laundryOptions) {
          const { error: optionError } = await supabase
            .from('ticket_laundry_options')
            .insert({
              ticket_id: ticketId,
              option_type: option
            });
          
          if (optionError) {
            console.error('Error creating laundry option:', optionError);
          }
        }
      }
      
      // Mark as synced locally
      ticket.pendingSync = false;
      ticket.synced = true;
      
      syncedCount++;
    }
    
    return syncedCount;
  } catch (error) {
    console.error('Error in syncTickets:', error);
    return 0;
  }
};
