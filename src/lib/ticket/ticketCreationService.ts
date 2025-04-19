
import { Ticket, Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
// Import customer service functions directly without using createCustomer
import { storeCustomer, getCustomerByPhone } from '@/lib/data/customer/customerStorageService';

/**
 * Create a new ticket
 */
export const createTicket = async (
  ticket: Partial<Ticket>,
  customer: Partial<Customer>
): Promise<string | null> => {
  try {
    // Get or create customer
    let customerId = null;
    if (customer.phone) {
      const existingCustomer = await getCustomerByPhone(customer.phone);
      
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else if (customer.name && customer.phone) {
        // Create new customer
        const newCustomer = await storeCustomer({
          name: customer.name,
          phoneNumber: customer.phone
        });
        customerId = newCustomer?.id || null;
      }
    }
    
    if (!customerId) {
      throw new Error('Could not determine customer for ticket');
    }
    
    // Generate ticket number
    const { data: ticketNumber, error: ticketNumberError } = await supabase
      .rpc('get_next_ticket_number');
      
    if (ticketNumberError) throw ticketNumberError;
    
    // Create ticket
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: customerId,
        total: ticket.totalPrice || 0,
        payment_method: ticket.paymentMethod || 'cash',
        status: ticket.status || 'pending',
        is_paid: ticket.isPaid || false,
        valet_quantity: ticket.valetQuantity || 0,
        date: new Date().toISOString()
      })
      .select('id')
      .single();
      
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    toast.error('Error al crear el ticket');
    return null;
  }
};
