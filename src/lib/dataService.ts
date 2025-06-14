import { supabase } from '@/integrations/supabase/client';
import { Ticket, Customer, ClientVisit } from '@/lib/types';
import { toast } from '@/lib/toast';
import { calculateVisitFrequency } from '@/lib/customer/frequencyUtils';

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
 * Get customer by phone
 */
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      phoneNumber: data.phone,
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      lastVisit: data.last_visit,
      valetsRedeemed: data.valets_redeemed || 0,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error fetching customer by phone:', error);
    return null;
  }
};

/**
 * Get client visits (all customers formatted as client visits)
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
      customerName: customer.name,
      customerId: customer.id, 
      phoneNumber: customer.phone || '',
      visitCount: customer.valets_count || 0,
      lastVisitDate: customer.last_visit || '',
      lastVisit: customer.last_visit || '',
      visitDate: customer.last_visit || new Date().toISOString(),
      total: 0,
      isPaid: false,
      loyaltyPoints: customer.loyalty_points || 0,
      freeValets: customer.free_valets || 0,
      valetsCount: customer.valets_count || 0,
      visitFrequency: calculateVisitFrequency(customer.last_visit)
    }));
  } catch (error) {
    console.error('Error fetching client visits:', error);
    return [];
  }
};

/**
 * Get all customers
 */
export const getAllClients = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      phoneNumber: customer.phone,
      loyaltyPoints: customer.loyalty_points || 0,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      lastVisit: customer.last_visit,
      valetsRedeemed: customer.valets_redeemed || 0,
      createdAt: customer.created_at
    }));
  } catch (error) {
    console.error('Error fetching all clients:', error);
    return [];
  }
};

/**
 * Get unretrieved tickets - tickets that are ready but not delivered
 */
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    console.log('Fetching unretrieved tickets from database...');
    
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        total,
        payment_method,
        status,
        is_paid,
        valet_quantity,
        created_at,
        delivered_date,
        customer_id,
        date,
        customers (name, phone)
      `)
      .in('status', ['ready'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching unretrieved tickets:', error);
      throw error;
    }

    console.log('Raw data from database:', data);

    if (!data || !Array.isArray(data)) {
      console.log('No data returned or data is not an array');
      return [];
    }

    const transformedTickets = data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || '',
      total: Number(ticket.total),
      totalPrice: Number(ticket.total),
      paymentMethod: ticket.payment_method,
      status: ticket.status,
      date: ticket.date || ticket.created_at,
      isPaid: ticket.is_paid,
      valetQuantity: ticket.valet_quantity,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      customerId: ticket.customer_id,
      customer: ticket.customers ? {
        name: ticket.customers.name,
        phone: ticket.customers.phone || ''
      } : undefined
    }));

    console.log('Transformed tickets:', transformedTickets);
    return transformedTickets;
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    return [];
  }
};

/**
 * Function for client frequency analysis
 */
export const getClientVisitFrequency = async (): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      throw error;
    }

    // Convert local tickets to client visits if API fails
    const result: ClientVisit[] = data.map(customer => ({
      id: customer.id,
      clientName: customer.name,
      customerName: customer.name,
      customerId: customer.id,
      phoneNumber: customer.phone || '',
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit || '',
      lastVisitDate: customer.last_visit || '',
      visitDate: customer.last_visit || new Date().toISOString(),
      loyaltyPoints: customer.loyalty_points || 0,
      freeValets: customer.free_valets || 0,
      valetsCount: customer.valets_count || 0,
      visitFrequency: calculateVisitFrequency(customer.last_visit),
      total: 0,
      isPaid: false
    }));

    return result;
  } catch (error) {
    console.error('Error retrieving client visit frequency:', error);
    return [];
  }
};
