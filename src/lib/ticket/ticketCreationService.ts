
import { supabase } from '@/integrations/supabase/client';
import { Ticket, Customer, LaundryOption } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { toast } from '@/lib/toast';
import { storeCustomer } from '@/lib/data/customer/customerStorageService';

/**
 * Creates a new ticket
 */
export const createTicket = async (
  ticketData: Partial<Ticket>,
  customerData: Partial<Customer>,
  dryCleaningItems: any[] = [],
  laundryOptions: LaundryOption[] = []
): Promise<Ticket | null> => {
  try {
    // First, ensure the customer exists
    const customer = await storeCustomer({
      name: customerData.name || 'Cliente',
      phoneNumber: customerData.phoneNumber || '',
    });

    if (!customer) {
      throw new Error('Failed to create or update customer');
    }

    // Get next ticket number
    const ticketNumber = await getNextTicketNumber();

    // Create the ticket
    const { data: ticketResult, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        total: ticketData.totalPrice || 0,
        payment_method: ticketData.paymentMethod || 'cash',
        customer_id: customer.id,
        status: ticketData.status || 'pending',
        is_paid: ticketData.isPaid || false,
        valet_quantity: ticketData.valetQuantity || 0
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    }

    // Create dry cleaning items if any
    if (dryCleaningItems && dryCleaningItems.length > 0) {
      const dryCleaningRecords = dryCleaningItems.map(item => ({
        ticket_id: ticketResult.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningRecords);

      if (dryCleaningError) {
        console.error('Error creating dry cleaning items:', dryCleaningError);
        // Continue anyway, don't throw
      }
    }

    // Create laundry options if any
    if (laundryOptions && laundryOptions.length > 0) {
      const laundryOptionRecords = laundryOptions.map(option => ({
        ticket_id: ticketResult.id,
        name: option.name,
        option_type: option.optionType,
        price: option.price || 0
      }));

      const { error: laundryOptionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionRecords);

      if (laundryOptionsError) {
        console.error('Error creating laundry options:', laundryOptionsError);
        // Continue anyway, don't throw
      }
    }

    // Return the created ticket in our application format
    return {
      id: ticketResult.id,
      ticketNumber: ticketResult.ticket_number,
      clientName: customer.name,
      phoneNumber: customer.phoneNumber,
      totalPrice: ticketResult.total,
      paymentMethod: ticketResult.payment_method,
      status: ticketResult.status,
      isPaid: ticketResult.is_paid,
      valetQuantity: ticketResult.valet_quantity,
      createdAt: ticketResult.created_at
    };
  } catch (error) {
    console.error('Error in createTicket:', error);
    return null;
  }
};
