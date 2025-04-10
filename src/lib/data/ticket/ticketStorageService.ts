
import { supabase } from '@/integrations/supabase/client';
import { formatPhoneNumber } from '../customer/phoneUtils';
import { LaundryOption, Customer } from '@/lib/types';

export const storeTicket = async (
  ticketData: any,
  customerData: any,
  dryCleaningItems: any[],
  laundryOptions: LaundryOption[]
): Promise<{ success: boolean; ticketId?: string }> => {
  try {
    // Format phone number
    const formattedPhone = formatPhoneNumber(customerData.phoneNumber);

    // First, check if the customer exists
    const { data: customerExists, error: customerError } = await supabase
      .from('customers')
      .select('id, loyalty_points, valets_count, free_valets')
      .eq('phone', formattedPhone)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      // Real error, not just "no rows returned"
      throw customerError;
    }

    let customerId;
    // If customer doesn't exist, create a new one
    if (!customerExists) {
      const newCustomer: Omit<Customer, 'id' | 'createdAt'> = {
        name: customerData.name,
        phone: formattedPhone, // Use the phone property
        phoneNumber: formattedPhone, // Also set phoneNumber for compatibility
        loyaltyPoints: customerData.loyaltyPoints || 0,
        valetsCount: customerData.valetsCount || 0,
        freeValets: customerData.freeValets || 0
      };

      const { data: createdCustomer, error: createError } = await supabase
        .from('customers')
        .insert([{
          name: newCustomer.name,
          phone: newCustomer.phone,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0
        }])
        .select('id')
        .single();

      if (createError) throw createError;
      customerId = createdCustomer.id;
    } else {
      customerId = customerExists.id;
    }

    // Create the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert([{
        customer_id: customerId,
        ticket_number: ticketData.ticketNumber,
        total: ticketData.totalPrice,
        payment_method: ticketData.paymentMethod,
        is_paid: ticketData.isPaid || false,
        basket_ticket_number: ticketData.basketTicketNumber || null,
        valet_quantity: ticketData.valetQuantity || 0,
        status: 'pending'
      }])
      .select('id')
      .single();

    if (ticketError) throw ticketError;

    // If there are dry cleaning items, insert them
    if (dryCleaningItems.length > 0) {
      const dryCleaningInserts = dryCleaningItems.map(item => ({
        ticket_id: ticket.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningInserts);

      if (itemsError) throw itemsError;
    }

    // If there are laundry options, insert them
    if (laundryOptions.length > 0) {
      const laundryOptionInserts = laundryOptions.map(option => ({
        ticket_id: ticket.id,
        option_type: option.id
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionInserts);

      if (optionsError) throw optionsError;
    }

    return { success: true, ticketId: ticket.id };
  } catch (error) {
    console.error('Error storing ticket:', error);
    return { success: false };
  }
};

// Export additional functions as needed

