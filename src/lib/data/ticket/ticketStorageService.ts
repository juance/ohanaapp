
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { getNextTicketNumber } from './ticketNumberService';

/**
 * Store a ticket in the database
 * @param ticketData Ticket data to store
 * @param customerData Customer data to store
 * @param dryCleaningItems Dry cleaning items to store
 * @param laundryOptions Laundry options to store
 */
export const storeTicket = async (
  ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'customer' | 'dryCleaningItems' | 'laundryOptions'> & {
    customDate?: Date;
    isPaidInAdvance?: boolean;
  },
  customerData: { name: string, phoneNumber: string },
  dryCleaningItems: Omit<DryCleaningItem, 'id' | 'ticketId'>[],
  laundryOptions: LaundryOption[]
): Promise<boolean> => {
  try {
    console.log('Starting ticket storage process with data:', {
      customerData,
      dryCleaningItems,
      laundryOptions,
      ticketData
    });
    
    // 1. Get or create customer
    let customerId: string;
    
    // First, try to find existing customer by phone
    const { data: existingCustomers, error: searchError } = await supabase
      .from('customers')
      .select('id, name, phone')
      .eq('phone', customerData.phoneNumber)
      .limit(1);

    if (searchError) {
      console.error('Error searching for customer:', searchError);
      throw searchError;
    }

    if (existingCustomers && existingCustomers.length > 0) {
      // Customer exists
      customerId = existingCustomers[0].id;
      console.log('Customer found with ID:', customerId);
    } else {
      // Customer doesn't exist, create new one
      console.log('Customer not found, creating new customer:', customerData);
      
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phoneNumber,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0,
          valets_redeemed: 0
        })
        .select('id')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw customerError;
      }

      if (!newCustomer?.id) {
        throw new Error('Failed to create customer - no ID returned');
      }

      customerId = newCustomer.id;
      console.log('Customer created successfully with ID:', customerId);
    }

    // 2. Get next ticket number
    const ticketNumber = await getNextTicketNumber();
    console.log('Generated ticket number:', ticketNumber);

    // 3. Create ticket
    const { data: newTicket, error: ticketError } = await supabase
      .from('tickets')
      .insert([
        {
          ticket_number: ticketNumber,
          total: ticketData.totalPrice,
          payment_method: ticketData.paymentMethod,
          valet_quantity: ticketData.valetQuantity,
          customer_id: customerId,
          date: ticketData.customDate?.toISOString() || new Date().toISOString(),
          is_paid: ticketData.isPaidInAdvance || ticketData.isPaid || false,
          status: ticketData.status || 'pending'
        }
      ])
      .select()
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    }

    if (!newTicket) {
      throw new Error('Error creating ticket - no data returned');
    }

    const ticketId = newTicket.id;
    console.log('Created ticket with ID:', ticketId);

    // 4. Create dry cleaning items with detailed logging
    if (dryCleaningItems && dryCleaningItems.length > 0) {
      console.log('Processing dry cleaning items for storage:', dryCleaningItems);
      
      const dryCleaningItemsToInsert = dryCleaningItems.map(item => {
        const itemToInsert = {
          name: item.name || 'Servicio de tintorería',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          ticket_id: ticketId
        };
        console.log('Inserting dry cleaning item:', itemToInsert);
        return itemToInsert;
      });

      console.log('Final dry cleaning items to insert:', dryCleaningItemsToInsert);

      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningItemsToInsert);

      if (dryCleaningError) {
        console.error('Error inserting dry cleaning items:', dryCleaningError);
        throw dryCleaningError;
      }
      
      console.log('Successfully inserted dry cleaning items');
    }

    // 5. Create laundry options
    if (laundryOptions && laundryOptions.length > 0) {
      const laundryOptionsToInsert = laundryOptions.map(option => ({
        option_type: option.name || option.optionType,
        ticket_id: ticketId
      }));

      const { error: laundryError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionsToInsert);

      if (laundryError) {
        console.error('Error inserting laundry options:', laundryError);
        throw laundryError;
      }
    }

    // 6. Si no hay servicios de lavado en seco, crear un servicio por defecto solo para valets
    if ((!dryCleaningItems || dryCleaningItems.length === 0) && ticketData.valetQuantity > 0) {
      console.log('Creating default valet service for ticket');
      const quantity = ticketData.valetQuantity || 1;
      const price = ticketData.totalPrice / quantity;

      const { error: defaultServiceError } = await supabase
        .from('dry_cleaning_items')
        .insert({
          ticket_id: ticketId,
          name: quantity > 1 ? 'Valets' : 'Valet',
          quantity: quantity,
          price: price
        });

      if (defaultServiceError) {
        console.error('Error creating default service:', defaultServiceError);
        // No lanzamos error para no interrumpir el flujo si falla la creación del servicio por defecto
      }
    }

    console.log('Ticket stored successfully with all service details');
    return true;
  } catch (error) {
    console.error('Error storing ticket:', error);
    return false;
  }
};
