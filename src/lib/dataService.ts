
// Import required modules
import { supabase } from '@/integrations/supabase/client';
import { getNextTicketNumber } from './data/ticket/ticketNumberService';
import { getFromLocalStorage, saveToLocalStorage, TICKETS_STORAGE_KEY } from './data/coreUtils';
import { Customer, Ticket, LaundryOption, ClientVisit, convertCustomerToClientVisit } from './types';
import { getClientVisitFrequency } from './data/clientService';

// Constants for local storage
export const CLIENT_STORAGE_KEY = 'clients';

// Re-export functions from client service
export { getClientVisitFrequency } from './data/clientService';

// Re-export other useful functions
export { 
  getNextTicketNumber 
} from './data/ticket/ticketNumberService';

// Export getCustomerByPhone for other modules to use
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    if (!phone) {
      throw new Error('Phone number is required');
    }

    // Clean the phone number for searching (remove non-numeric characters)
    const cleanedPhone = phone.replace(/\D/g, '');

    // Search by phone number using LIKE for a more flexible search
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`phone.ilike.%${cleanedPhone}%,phone.ilike.%${phone}%`);

    if (error) throw error;

    // Return the customer if found
    if (data && data.length > 0) {
      return {
        id: data[0].id,
        name: data[0].name,
        phoneNumber: data[0].phone,
        phone: data[0].phone,
        loyaltyPoints: data[0].loyalty_points || 0,
        valetsCount: data[0].valets_count || 0,
        freeValets: data[0].free_valets || 0,
        lastVisit: data[0].last_visit,
        valetsRedeemed: data[0].valets_redeemed || 0,
        createdAt: data[0].created_at
      };
    }

    // Customer not found
    return null;
  } catch (error) {
    console.error('Error getting customer by phone:', error);
    throw error;
  }
};

// Define the saveTicket function (used in storeTicket)
const saveTicket = async (ticketData: any) => {
  try {
    // Get existing tickets from local storage
    const existingTickets = getFromLocalStorage<Ticket>(TICKETS_STORAGE_KEY) || [];
    
    // Add the new ticket
    existingTickets.push(ticketData);
    
    // Save back to local storage
    saveToLocalStorage(TICKETS_STORAGE_KEY, existingTickets);
    
    // Try to save to Supabase if available
    try {
      const { error } = await supabase
        .from('tickets')
        .insert([{
          ticket_number: ticketData.ticketNumber,
          customer_id: ticketData.customerId,
          total: ticketData.totalPrice,
          payment_method: ticketData.paymentMethod,
          status: ticketData.status,
          is_paid: ticketData.isPaid,
          valet_quantity: ticketData.valetQuantity || 0,
          created_at: ticketData.createdAt,
          delivered_date: ticketData.deliveredDate,
          // Additional fields for client information - need to be saved in custom columns
          name: ticketData.clientName,
          phone: ticketData.phoneNumber
        }]);
      
      if (error) throw error;
    } catch (supabaseError) {
      console.warn('Could not save ticket to Supabase, saved locally only:', supabaseError);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving ticket:', error);
    return false;
  }
};

// Add a storeTicket function for the component
export const storeTicket = async (
  ticketData: any, 
  customerData: any, 
  dryCleaningItemsData: any, 
  laundryOptions: any
) => {
  try {
    // Generate a ticket number if not provided
    if (!ticketData.ticketNumber) {
      ticketData.ticketNumber = await getNextTicketNumber();
    }
    
    // Create or update customer record
    let customerId = null;
    try {
      const { data: customerExists } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customerData.phoneNumber)
        .single();
      
      if (customerExists) {
        // Update existing customer
        customerId = customerExists.id;
        const { data, error } = await supabase
          .from('customers')
          .update({
            name: customerData.name,
            last_visit: new Date().toISOString(),
            valets_count: supabase.rpc('increment', { 
              row_id: customerId,
              table: 'customers',
              column: 'valets_count',
              amount: 1
            })
          })
          .eq('id', customerId);

        if (error) throw error;
      } else {
        // Create new customer
        const { data: newCustomer, error } = await supabase
          .from('customers')
          .insert([{
            name: customerData.name,
            phone: customerData.phoneNumber,
            last_visit: new Date().toISOString(),
            valets_count: 1,
            free_valets: 0
          }])
          .select();
        
        if (error) throw error;
        if (newCustomer && newCustomer.length > 0) {
          customerId = newCustomer[0].id;
        }
      }
    } catch (customerError) {
      console.warn('Could not update customer in Supabase:', customerError);
    }
    
    // Save the ticket
    ticketData.customerId = customerId;
    const success = await saveTicket({
      ...ticketData,
      clientName: customerData.name,
      phoneNumber: customerData.phoneNumber,
      createdAt: ticketData.customDate ? ticketData.customDate.toISOString() : new Date().toISOString(),
      services: dryCleaningItemsData
    });
    
    // Save laundry options if provided
    if (success && laundryOptions && laundryOptions.length > 0) {
      try {
        const ticketId = ticketData.id || `local-${Date.now()}`;
        
        // Save to Supabase if available
        await supabase
          .from('ticket_laundry_options')
          .insert(laundryOptions.map((option: any) => ({
            name: option.name,
            option_type: option.optionType || option.option_type,
            ticket_id: ticketId
          })));
      } catch (optionsError) {
        console.warn('Could not save laundry options to Supabase:', optionsError);
      }
    }
    
    return success;
  } catch (error) {
    console.error('Error storing ticket:', error);
    return false;
  }
};

// Add getAllClients function
export const getAllClients = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phone,
      phone: customer.phone,
      lastVisit: customer.last_visit,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      valetsRedeemed: customer.valets_redeemed || 0,
      createdAt: customer.created_at
    }));
  } catch (error) {
    console.error('Error fetching clients:', error);
    
    // Fallback to local storage
    const localClients = getFromLocalStorage<Customer>(CLIENT_STORAGE_KEY) || [];
    return localClients;
  }
};

// Get tickets that are ready for pickup
export const getPickupTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'ready')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Map to our Ticket type
    return data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || '',
      status: ticket.status || '',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at || '',
      deliveredDate: ticket.delivered_date || null
    }));
  } catch (error) {
    console.error('Error fetching pickup tickets:', error);
    
    // Fallback to local storage
    const localTickets = getFromLocalStorage<Ticket>(TICKETS_STORAGE_KEY) || [];
    return localTickets.filter(ticket => ticket.status === 'ready');
  }
};

// Get tickets that are unretrieved (ready but not delivered)
export const getUnretrievedTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (name, phone)
      `)
      .eq('status', 'ready')
      .is('delivered_date', null)
      .order('created_at');
      
    if (error) throw error;
    
    if (!data) return [];
    
    // Map to our Ticket type
    return data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      clientName: ticket.customers?.name || '',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || '',
      status: ticket.status || '',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at || '',
      deliveredDate: ticket.delivered_date || null
    }));
  } catch (error) {
    console.error('Error fetching unretrieved tickets:', error);
    
    // Fallback to local storage
    const localTickets = getFromLocalStorage<Ticket>(TICKETS_STORAGE_KEY) || [];
    return localTickets.filter(ticket => ticket.status === 'ready' && !ticket.deliveredDate);
  }
};

// Mark a ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const deliveredDate = new Date().toISOString();
    
    // Update in Supabase
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        delivered_date: deliveredDate
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    // Also update in local storage
    const localTickets = getFromLocalStorage<Ticket>(TICKETS_STORAGE_KEY) || [];
    const updatedTickets = localTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'delivered',
          deliveredDate
        };
      }
      return ticket;
    });
    
    saveToLocalStorage(TICKETS_STORAGE_KEY, updatedTickets);
    
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    return false;
  }
};

// Cancel a ticket
export const cancelTicket = async (ticketId: string): Promise<boolean> => {
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'cancelled'
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    // Also update in local storage
    const localTickets = getFromLocalStorage<Ticket>(TICKETS_STORAGE_KEY) || [];
    const updatedTickets = localTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'cancelled'
        };
      }
      return ticket;
    });
    
    saveToLocalStorage(TICKETS_STORAGE_KEY, updatedTickets);
    
    return true;
  } catch (error) {
    console.error('Error cancelling ticket:', error);
    return false;
  }
};
