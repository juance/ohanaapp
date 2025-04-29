import { Ticket, Client, ClientVisit, Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

// Get all clients
export const getAllClients = async (): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((client: any) => ({
      id: client.id,
      clientName: client.name,
      phoneNumber: client.phone_number,
      visitCount: client.visit_count || 0,
      lastVisit: client.last_visit || null,
      lastVisitDate: client.last_visit || null, // For compatibility
      valetsCount: client.valets_count || 0,
      freeValets: client.free_valets || 0,
      loyaltyPoints: client.loyalty_points || 0,
      visitFrequency: client.visit_frequency || 'occasional'
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

// Get unretrieved tickets (status = 'ready' but not delivered)
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('status', 'ready')
      .is('delivered_date', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.client_name,
      phoneNumber: ticket.phone_number,
      status: ticket.status,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      totalPrice: ticket.total_price,
      paymentMethod: ticket.payment_method || 'cash',
      valetQuantity: ticket.valet_quantity || 0,
      isPaid: ticket.is_paid || false
    }));
  } catch (error) {
    console.error("Error fetching unretrieved tickets:", error);
    return [];
  }
};

// Get customer by phone
export const getCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No customer found
        return null;
      }
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone_number,
      lastVisit: data.last_visit,
      loyaltyPoints: data.loyalty_points || 0,
      freeValets: data.free_valets || 0,
      valetsCount: data.valets_count || 0,
      valetsRedeemed: data.valets_redeemed || 0,
      createdAt: data.created_at,
      visitCount: data.visit_count || 0,
      visitFrequency: data.visit_frequency || 'occasional'
    };
  } catch (error) {
    console.error("Error fetching customer by phone:", error);
    return null;
  }
};

// Store a new ticket
export const storeTicket = async (
  ticketData: any,
  customerData: any,
  dryCleaningItems: any[],
  laundryOptions: any[]
): Promise<boolean> => {
  try {
    // Generate ticket number (you might have a different logic)
    const ticketNumber = `T${Date.now().toString().slice(-6)}`;
    
    // Insert ticket
    const { data: ticketResult, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        client_name: customerData.name,
        phone_number: customerData.phoneNumber,
        status: ticketData.status || 'pending',
        total_price: ticketData.totalPrice,
        payment_method: ticketData.paymentMethod,
        valet_quantity: ticketData.valetQuantity || 0,
        is_paid: ticketData.isPaid || false,
        created_at: new Date().toISOString(),
        delivered_date: null
      })
      .select('id')
      .single();

    if (ticketError) throw ticketError;
    
    const ticketId = ticketResult.id;
    
    // Update or create customer
    const { data: existingCustomer, error: customerQueryError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone_number', customerData.phoneNumber)
      .maybeSingle();
      
    if (customerQueryError && customerQueryError.code !== 'PGRST116') throw customerQueryError;
    
    if (existingCustomer) {
      // Update existing customer
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          last_visit: new Date().toISOString(),
          visit_count: (existingCustomer.visit_count || 0) + 1,
          valets_count: ticketData.usesFreeValet 
            ? existingCustomer.valets_count || 0 
            : (existingCustomer.valets_count || 0) + (ticketData.valetQuantity || 0)
        })
        .eq('id', existingCustomer.id);
        
      if (updateError) throw updateError;
    } else {
      // Create new customer
      const { error: createError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone_number: customerData.phoneNumber,
          last_visit: new Date().toISOString(),
          visit_count: 1,
          valets_count: ticketData.valetQuantity || 0,
          free_valets: 0,
          loyalty_points: 0
        });
        
      if (createError) throw createError;
    }
    
    // Insert dry cleaning items if any
    if (dryCleaningItems && dryCleaningItems.length > 0) {
      const itemsToInsert = dryCleaningItems.map(item => ({
        ticket_id: ticketId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        created_at: new Date().toISOString()
      }));
      
      const { error: itemsError } = await supabase
        .from('ticket_items')
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
    }
    
    // Insert laundry options if any
    if (laundryOptions && laundryOptions.length > 0) {
      const optionsToInsert = laundryOptions.map(option => ({
        ticket_id: ticketId,
        name: option.name,
        option_type: option.option_type || option.optionType,
        created_at: new Date().toISOString()
      }));
      
      const { error: optionsError } = await supabase
        .from('laundry_options')
        .insert(optionsToInsert);
        
      if (optionsError) throw optionsError;
    }
    
    return true;
  } catch (error) {
    console.error("Error storing ticket:", error);
    return false;
  }
};

// Get tickets for pickup (status = 'ready' or 'processing')
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        ticket_items (*)
      `)
      .in('status', ['ready', 'processing'])
      .is('delivered_date', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.client_name,
      phoneNumber: ticket.phone_number,
      status: ticket.status,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      totalPrice: ticket.total_price,
      paymentMethod: ticket.payment_method || 'cash',
      valetQuantity: ticket.valet_quantity || 0,
      isPaid: ticket.is_paid || false,
      services: ticket.ticket_items ? ticket.ticket_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })) : []
    }));
  } catch (error) {
    console.error("Error fetching pickup tickets:", error);
    return [];
  }
};

// Mark ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking ticket as delivered:", error);
    return false;
  }
};

// Cancel ticket
export const cancelTicket = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'cancelled'
      })
      .eq('id', ticketId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    return false;
  }
};

// Update payment method
export const updatePaymentMethod = async (ticketId: string, paymentMethod: string, isPaid: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        payment_method: paymentMethod,
        is_paid: isPaid
      })
      .eq('id', ticketId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating payment method:", error);
    return false;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        ticket_items (*)
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      clientName: data.client_name,
      phoneNumber: data.phone_number,
      status: data.status,
      createdAt: data.created_at,
      deliveredDate: data.delivered_date,
      totalPrice: data.total_price,
      paymentMethod: data.payment_method || 'cash',
      valetQuantity: data.valet_quantity || 0,
      isPaid: data.is_paid || false,
      services: data.ticket_items ? data.ticket_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })) : []
    };
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    return null;
  }
};

// Get recent tickets
export const getRecentTickets = async (limit: number = 10): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.client_name,
      phoneNumber: ticket.phone_number,
      status: ticket.status,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      totalPrice: ticket.total_price,
      paymentMethod: ticket.payment_method || 'cash',
      valetQuantity: ticket.valet_quantity || 0,
      isPaid: ticket.is_paid || false
    }));
  } catch (error) {
    console.error("Error fetching recent tickets:", error);
    return [];
  }
};

// Search tickets
export const searchTickets = async (query: string): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .or(`client_name.ilike.%${query}%,phone_number.ilike.%${query}%,ticket_number.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.client_name,
      phoneNumber: ticket.phone_number,
      status: ticket.status,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      totalPrice: ticket.total_price,
      paymentMethod: ticket.payment_method || 'cash',
      valetQuantity: ticket.valet_quantity || 0,
      isPaid: ticket.is_paid || false
    }));
  } catch (error) {
    console.error("Error searching tickets:", error);
    return [];
  }
};
