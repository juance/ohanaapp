import { supabase } from '@/integrations/supabase/client';
import { Ticket, Customer, ClientVisit } from '@/lib/types';
import { toast } from '@/lib/toast';

/**
 * Get the next ticket number from the sequence
 */
export const getNextTicketNumber = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_next_ticket_number');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting next ticket number:', error);
    return null;
  }
};

/**
 * Store a ticket in the database
 */
export const storeTicket = async (ticket: any): Promise<boolean> => {
  try {
    // First get or create the customer
    let customerId = await getOrCreateCustomer(ticket.clientName, ticket.phoneNumber);
    
    if (!customerId) {
      throw new Error('Failed to create or find customer');
    }

    // Get the next ticket number
    const ticketNumber = await getNextTicketNumber();
    
    if (!ticketNumber) {
      throw new Error('Failed to get next ticket number');
    }

    // Insert the ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: customerId,
        total: ticket.totalPrice,
        payment_method: ticket.paymentMethod,
        status: ticket.status || 'pending',
        is_paid: ticket.isPaid,
        valet_quantity: ticket.valetQuantity,
      })
      .select()
      .single();

    if (ticketError) {
      throw ticketError;
    }

    // Insert dry cleaning items if any
    if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
      const dryCleaningItemsWithId = ticket.dryCleaningItems.map((item: any) => ({
        ticket_id: ticketData.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningItemsWithId);

      if (itemsError) {
        console.error('Error inserting dry cleaning items:', itemsError);
        // Continue anyway, at least the ticket was created
      }
    }

    // Insert laundry options if any
    if (ticket.laundryOptions && ticket.laundryOptions.length > 0) {
      const laundryOptionsWithId = ticket.laundryOptions.map((option: any) => ({
        ticket_id: ticketData.id,
        option_type: option.optionType || option.name
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionsWithId);

      if (optionsError) {
        console.error('Error inserting laundry options:', optionsError);
        // Continue anyway, at least the ticket was created
      }
    }

    toast.success('Ticket created successfully');
    return true;
  } catch (error) {
    console.error('Error creating ticket:', error);
    toast.error('Error creating ticket');
    return false;
  }
};

/**
 * Get or create a customer by name and phone
 */
export const getOrCreateCustomer = async (name: string, phone: string): Promise<string | null> => {
  try {
    // Check if customer exists
    const { data: existingCustomers, error: fetchError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone);

    if (fetchError) {
      throw fetchError;
    }

    if (existingCustomers && existingCustomers.length > 0) {
      return existingCustomers[0].id;
    }

    // Create new customer
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        name: name,
        phone: phone
      })
      .select('id')
      .single();

    if (insertError) {
      throw insertError;
    }

    return newCustomer.id;
  } catch (error) {
    console.error('Error getting or creating customer:', error);
    return null;
  }
};

/**
 * Get client visits (placeholder implementation)
 */
export const getClientVisits = async (): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map((customer: any) => ({
      id: customer.id,
      clientName: customer.name,
      phoneNumber: customer.phone,
      visitCount: customer.valets_count || 0,
      lastVisitDate: customer.last_visit,
      loyaltyPoints: customer.loyalty_points || 0,
      freeValets: customer.free_valets || 0
    }));
  } catch (error) {
    console.error('Error fetching client visits:', error);
    return [];
  }
};
