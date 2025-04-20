
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { getNextTicketNumber } from './ticketNumberService';
import { storeCustomer, getCustomerByPhone } from '../customer/customerStorageService';

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
    // 1. Get or create customer
    let customer = await getCustomerByPhone(customerData.phoneNumber);
    if (!customer) {
      customer = await storeCustomer(customerData);
    }

    if (!customer?.id) {
      throw new Error('Customer ID is missing');
    }

    // 2. Get next ticket number
    const ticketNumber = await getNextTicketNumber();

    // 3. Create ticket
    const { data: newTicket, error: ticketError } = await supabase
      .from('tickets')
      .insert([
        {
          ticket_number: ticketNumber,
          total: ticketData.totalPrice,
          payment_method: ticketData.paymentMethod,
          valet_quantity: ticketData.valetQuantity,
          customer_id: customer.id,
          date: ticketData.customDate?.toISOString() || new Date().toISOString(),
          is_paid: ticketData.isPaidInAdvance || ticketData.isPaid || false,
          status: ticketData.status || 'pending'
        }
      ])
      .select()
      .single();

    if (ticketError) {
      throw ticketError;
    }

    if (!newTicket) {
      throw new Error('Error creating ticket');
    }

    const ticketId = newTicket.id;

    // 4. Create dry cleaning items
    if (dryCleaningItems && dryCleaningItems.length > 0) {
      const dryCleaningItemsToInsert = dryCleaningItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ticket_id: ticketId
      }));

      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningItemsToInsert);

      if (dryCleaningError) {
        throw dryCleaningError;
      }
    }

    // 5. Create laundry options
    if (laundryOptions && laundryOptions.length > 0) {
      const laundryOptionsToInsert = laundryOptions.map(option => ({
        option_type: option.name,
        ticket_id: ticketId
      }));

      const { error: laundryError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionsToInsert);

      if (laundryError) {
        throw laundryError;
      }
    }

    // 6. Si no hay servicios de lavado en seco, crear un servicio por defecto
    if (!dryCleaningItems || dryCleaningItems.length === 0) {
      console.log('Creando servicio por defecto para el ticket');
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
        console.error('Error al crear servicio por defecto:', defaultServiceError);
        // No lanzamos error para no interrumpir el flujo si falla la creación del servicio por defecto
      }
    }

    return true;
  } catch (error) {
    console.error('Error storing ticket:', error);
    return false;
  }
};
