
/**
 * Unified Ticket Service
 *
 * This service provides a unified interface for ticket operations across different
 * status transitions. It abstracts the complexity of the different ticket statuses
 * and provides a simple API for ticket operations.
 */

import { supabase } from '@/integrations/supabase/client';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { toast } from '@/lib/toast';

/**
 * Create a unified ticket with the given information
 * The ticket will be created with the 'ready' status by default
 */
export const createUnifiedTicket = async ({
  customerName,
  phoneNumber,
  totalPrice,
  paymentMethod,
  valetQuantity = 0,
  customDate,
  isPaidInAdvance = false
}: {
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  valetQuantity?: number;
  customDate?: Date;
  isPaidInAdvance?: boolean;
}) => {
  try {
    console.log('Creating unified ticket');
    // First, get the next ticket number
    const { data: ticketNumber, error: ticketNumberError } = await supabase
      .rpc('get_next_ticket_number');

    if (ticketNumberError) {
      console.error('Error getting next ticket number:', ticketNumberError);
      throw ticketNumberError;
    }

    // Find or create customer
    let customerId: string | null = null;

    // Check if customer exists
    const { data: existingCustomer, error: customerQueryError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phoneNumber)
      .maybeSingle();

    if (customerQueryError) {
      console.error('Error finding customer:', customerQueryError);
      throw customerQueryError;
    }

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      // Create new customer
      const { data: newCustomer, error: createCustomerError } = await supabase
        .from('customers')
        .insert({
          name: customerName,
          phone: phoneNumber
        })
        .select('id')
        .single();

      if (createCustomerError) {
        console.error('Error creating customer:', createCustomerError);
        throw createCustomerError;
      }

      customerId = newCustomer.id;
    }

    // Now create the ticket
    const now = new Date().toISOString();
    const ticketDate = customDate ? customDate.toISOString() : now;

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: customerId,
        total: totalPrice,
        payment_method: paymentMethod,
        valet_quantity: valetQuantity,
        status: TICKET_STATUS.READY, // Set the status to READY by default
        date: ticketDate,
        created_at: now,
        updated_at: now,
        is_paid: isPaidInAdvance
      })
      .select('id')
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    }

    // Update customer last visit
    await supabase
      .from('customers')
      .update({ last_visit: now })
      .eq('id', customerId);

    // Actualizar el contador de visitas del cliente si es un valet
    if (valetQuantity > 0) {
      try {
        // Importar la función desde el módulo correcto
        const { updateValetsCount } = await import('@/lib/data/customer/valetService');
        await updateValetsCount(customerId, valetQuantity);
        console.log(`Contador de valets actualizado para cliente ${customerId}: +${valetQuantity}`);
      } catch (valetError) {
        console.error('Error al actualizar contador de valets:', valetError);
        // No interrumpir el flujo si falla esta actualización
      }
    }

    return {
      success: true,
      ticketId: ticket.id,
      ticketNumber: ticketNumber
    };
  } catch (error) {
    console.error('Error creating unified ticket:', error);
    toast.error('Error al crear el ticket');
    return {
      success: false,
      ticketId: null,
      ticketNumber: null
    };
  }
};
