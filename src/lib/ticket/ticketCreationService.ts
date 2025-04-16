
/**
 * Ticket Creation Service
 *
 * Handles ticket creation operations with the Supabase database.
 */

import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/lib/types';
import { toast } from '@/lib/toast';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { getCustomerByPhone, createCustomer } from '@/lib/data/customerService';
import { ensureSupabaseSession } from '@/lib/auth/supabaseAuth';

/**
 * Create a new ticket in Supabase
 */
export const createTicket = async ({
  customerName,
  phoneNumber,
  totalPrice,
  paymentMethod,
  valetQuantity = 0,
  customDate = null
}: {
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  valetQuantity?: number;
  customDate?: Date | null;
}): Promise<{
  success: boolean;
  ticketNumber?: string;
  ticketId?: string;
  message?: string;
}> => {
  try {
    console.log('Creating ticket with the following information:');
    console.log(`Customer: ${customerName}, Phone: ${phoneNumber}`);
    console.log(`Total: ${totalPrice}, Payment Method: ${paymentMethod}`);
    console.log(`Valet Quantity: ${valetQuantity}`);

    // Verificar la conexión con Supabase
    const connectionActive = await ensureSupabaseSession();
    if (!connectionActive) {
      console.error('No se pudo establecer conexión con Supabase');
      toast.error('Error de conexión con el servidor');
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }

    // Get customer or create if not exists
    let customer = await getCustomerByPhone(phoneNumber);

    if (!customer) {
      console.log('Customer not found. Creating new customer.');
      customer = await createCustomer(customerName, phoneNumber);

      if (!customer) {
        throw new Error('Failed to create customer');
      }
    }

    console.log('Customer ID:', customer.id);

    // Get next ticket number
    const { data: ticketNumber, error: rpcError } = await supabase.rpc('get_next_ticket_number');

    if (rpcError) {
      console.error('Error getting next ticket number:', rpcError);
      throw rpcError;
    }

    console.log('Generated Ticket Number:', ticketNumber);

    const now = new Date();
    const ticketDate = customDate ? customDate : now;

    // Create the ticket with status READY by default
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: customer.id,
        total: totalPrice,
        payment_method: paymentMethod,
        status: TICKET_STATUS.READY, // Use the constant for consistency
        date: ticketDate.toISOString(),
        valet_quantity: valetQuantity,
        is_paid: false, // New tickets are not paid by default
        is_canceled: false // Explicitly set is_canceled to false
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }

    // Actualizar el contador de visitas del cliente si es un valet
    if (valetQuantity > 0) {
      try {
        // Importar la función desde el módulo correcto
        const { updateValetsCount } = await import('@/lib/data/customer/valetService');
        await updateValetsCount(customer.id, valetQuantity);
        console.log(`Contador de valets actualizado para cliente ${customer.id}: +${valetQuantity}`);
      } catch (valetError) {
        console.error('Error al actualizar contador de valets:', valetError);
        // No interrumpir el flujo si falla esta actualización
      }
    }

    console.log('Ticket created successfully:', ticket);

    return {
      success: true,
      ticketNumber: ticket.ticket_number,
      ticketId: ticket.id
    };
  } catch (error) {
    console.error('Error in createTicket:', error);
    toast.error('Error al crear el ticket');

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Calculate the total price for a ticket based on service type and options
 */
export const calculateTicketTotal = (
  serviceType: 'valet' | 'tintoreria',
  valetQuantity: number = 0,
  dryCleaningItems: Array<{ quantity: number; price: number }> = []
): number => {
  if (serviceType === 'valet') {
    // Valet price calculation
    return valetQuantity * 50; // $50 per valet
  } else {
    // Dry cleaning price calculation - sum of all items
    return dryCleaningItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  }
};
