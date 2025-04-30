// src/lib/dataService.ts
import { supabase } from '@/integrations/supabase/client';
import { Customer, Ticket } from '@/lib/types';

// Function to get the next ticket number
export const getNextTicketNumber = async (): Promise<string | null> => {
  try {
    // Use the stored procedure to get the next ticket number
    const { data, error } = await supabase.rpc('get_next_ticket_number');
    
    if (error) {
      console.error('Error getting next ticket number:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getNextTicketNumber:', error);
    return null;
  }
};

// Function to increment valets count - we won't use RPC since it doesn't exist
export const incrementValetsCount = async (customerId: string, quantity: number = 1): Promise<number> => {
  try {
    // First, get current value
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('valets_count')
      .eq('id', customerId)
      .single();
      
    if (fetchError) {
      console.error('Error getting customer valets count:', fetchError);
      return 0;
    }
    
    const currentCount = customer?.valets_count || 0;
    const newCount = currentCount + quantity;
    
    // Now update
    const { error: updateError } = await supabase
      .from('customers')
      .update({ valets_count: newCount })
      .eq('id', customerId);
      
    if (updateError) {
      console.error('Error updating valets count:', updateError);
      return 0;
    }
    
    return newCount;
  } catch (error) {
    console.error('Error in incrementValetsCount:', error);
    return 0;
  }
};

/**
 * Get a customer by ID
 * @param customerId Customer ID
 * @returns Customer object if found, null otherwise
 */
export const getCustomerById = async (customerId: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error) {
      console.error('Error getting customer by ID:', error);
      return null;
    }

    // Map database columns to Customer interface
    return {
      id: data.id,
      name: data.name || '',
      phone: data.phone || '',
      phoneNumber: data.phone || '',
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      loyaltyPoints: data.loyalty_points || 0,
      lastVisit: data.last_visit || '',
      valetsRedeemed: data.valets_redeemed || 0
    } as Customer;
  } catch (error) {
    console.error('Error in getCustomerById:', error);
    return null;
  }
};

/**
 * Get a customer by phone number
 * @param phoneNumber Phone number
 * @returns Customer object if found, null otherwise
 */
export const getUserByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      console.error('Error getting customer by phone:', error);
      return null;
    }

    // Map database columns to Customer interface
    return {
      id: data.id,
      name: data.name || '',
      phone: data.phone || '',
      phoneNumber: data.phone || '',
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      loyaltyPoints: data.loyalty_points || 0,
      lastVisit: data.last_visit || '',
      valetsRedeemed: data.valets_redeemed || 0
    } as Customer;
  } catch (error) {
    console.error('Error in getUserByPhone:', error);
    return null;
  }
};

/**
 * Alias for getUserByPhone for backward compatibility
 */
export const getCustomerByPhone = getUserByPhone;

/**
 * Get tickets that are ready but not yet retrieved
 */
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(*)')
      .eq('status', 'ready')
      .eq('is_paid', false)
      .is('delivered_date', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting unretrieved tickets:', error);
      return [];
    }

    // Map the response to Ticket objects
    return data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || 'Cliente sin nombre',
      phoneNumber: ticket.customers?.phone || 'Sin teléfono',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'ready',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      customerId: ticket.customer_id
    })) as Ticket[];
  } catch (error) {
    console.error('Error in getUnretrievedTickets:', error);
    return [];
  }
};

/**
 * Store a new ticket
 */
export const storeTicket = async (ticket: Ticket): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Map Ticket interface to database columns
    const ticketData = {
      ticket_number: ticket.ticketNumber,
      customer_id: ticket.customerId,
      total: ticket.totalPrice,
      payment_method: ticket.paymentMethod,
      status: ticket.status,
      is_paid: ticket.isPaid,
      valet_quantity: ticket.valetQuantity,
      delivered_date: ticket.deliveredDate
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert([ticketData])
      .select();

    if (error) {
      console.error('Error storing ticket:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data[0].id };
  } catch (error: any) {
    console.error('Error in storeTicket:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all clients/customers
 */
export const getAllClients = async (): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error getting all clients:', error);
      return [];
    }
    
    // Map to ClientVisit type
    return data.map(customer => ({
      id: customer.id,
      clientName: customer.name || '',
      phoneNumber: customer.phone || '',
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit || '',
      loyaltyPoints: customer.loyalty_points || 0,
      freeValets: customer.free_valets || 0,
      lastVisitDate: customer.last_visit || '',
      valetsCount: customer.valets_count || 0,
      visitFrequency: '' // This would be calculated - see convertCustomerToClientVisit
    }));
  } catch (error) {
    console.error('Error in getAllClients:', error);
    return [];
  }
};

// Fix the reference to ClientVisit type
export const convertCustomerToClientVisit = (customer: any): import('./types/customer.types').ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name || '',
    phoneNumber: customer.phone || '',
    visitCount: customer.valets_count || 0,
    lastVisit: customer.last_visit || '',
    loyaltyPoints: customer.loyalty_points || 0,
    freeValets: customer.free_valets || 0,
    lastVisitDate: customer.last_visit || '',
    valetsCount: customer.valets_count || 0,
    visitFrequency: '' // This would be calculated - see convertCustomerToClientVisit
  };
}
