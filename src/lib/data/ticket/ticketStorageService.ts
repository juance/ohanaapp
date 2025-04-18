
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { updateCustomerLastVisit } from '@/lib/data/customer/customerStorageService';
import { LaundryOption, Customer, PaymentMethod } from '@/lib/types';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { ensureSupabaseSession } from '@/lib/auth/supabaseAuth';
import { toast } from '@/lib/toast';
import { createTicket as createTicketFromCreationService } from '@/lib/ticket/ticketCreationService';

/**
 * Create a new ticket
 * This is an alias for the createTicket function in ticketCreationService.ts
 * to maintain compatibility with existing code
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
}) => {
  return createTicketFromCreationService({
    customerName,
    phoneNumber,
    totalPrice,
    paymentMethod,
    valetQuantity,
    customDate
  });
};

export const storeTicket = async (
  ticketData: {
    totalPrice: number;
    paymentMethod: string;
    valetQuantity: number;
    customDate?: Date;
    usesFreeValet?: boolean;
    isPaidInAdvance?: boolean;
  },
  customerData: {
    name: string;
    phoneNumber: string;
  },
  dryCleaningItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>,
  laundryOptions: LaundryOption[]
) => {
  try {
    // Verificar la conexión con Supabase
    const connectionActive = await ensureSupabaseSession();
    if (!connectionActive) {
      console.error('No se pudo establecer conexión con Supabase');
      toast.error('Error de conexión con el servidor');
      // Continuar con el código, se usará el fallback a localStorage si falla
    }
    // First, get the next ticket number
    const { data: ticketNumberData, error: ticketNumberError } = await supabase
      .rpc('get_next_ticket_number');

    if (ticketNumberError) {
      console.error('Error getting next ticket number:', ticketNumberError);
      throw ticketNumberError;
    }

    const ticketNumber = ticketNumberData;
    console.log('Generated ticket number:', ticketNumber);

    // Find or create customer
    let customerId: string | null = null;

    // Check if customer exists
    const { data: existingCustomers, error: customerQueryError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', customerData.phoneNumber)
      .maybeSingle();

    if (customerQueryError) {
      console.error('Error finding customer:', customerQueryError);
    }

    if (existingCustomers) {
      customerId = existingCustomers.id;
      console.log('Using existing customer:', customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: createCustomerError } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phoneNumber
        })
        .select('id')
        .single();

      if (createCustomerError) {
        console.error('Error creating customer:', createCustomerError);
        throw createCustomerError;
      }

      customerId = newCustomer.id;
      console.log('Created new customer:', customerId);
    }

    // Now create the ticket - IMPORTANT: Set status to READY so it appears in Pickup page
    console.log('Creating new ticket with status:', TICKET_STATUS.READY);
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: customerId,
        total: ticketData.totalPrice,
        payment_method: ticketData.paymentMethod,
        valet_quantity: ticketData.valetQuantity,
        status: TICKET_STATUS.READY, // Set to ready by default to show up in pickup page
        date: ticketData.customDate ? ticketData.customDate.toISOString() : new Date().toISOString(),
        is_paid: ticketData.isPaidInAdvance || false,
        is_canceled: false // Explicitly set is_canceled to false
      })
      .select('id')
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    }

    console.log('Created ticket:', ticket.id, 'with status:', TICKET_STATUS.READY);

    // Store dry cleaning items if any
    if (dryCleaningItems.length > 0) {
      const dryCleaningToInsert = dryCleaningItems.map(item => ({
        ticket_id: ticket.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: dryCleaningError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningToInsert);

      if (dryCleaningError) {
        console.error('Error storing dry cleaning items:', dryCleaningError);
      }
    }

    // Store laundry options if any
    if (laundryOptions.length > 0) {
      const optionsToInsert = laundryOptions.map(option => ({
        ticket_id: ticket.id,
        option_type: option.name
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(optionsToInsert);

      if (optionsError) {
        console.error('Error storing ticket laundry options:', optionsError);
      }
    }

    // Try to update the customer's last visit
    try {
      if (customerId) {
        await updateCustomerLastVisit(customerId);

        // Actualizar el contador de visitas del cliente si es un valet
        if (ticketData.valetQuantity > 0) {
          try {
            // Importar la función desde el nuevo servicio de fidelidad
            const { incrementCustomerVisits } = await import('@/lib/services/loyaltyService');
            const updated = await incrementCustomerVisits(customerId, ticketData.valetQuantity);
            console.log(`Contador de visitas actualizado para cliente ${customerId}: +${ticketData.valetQuantity}, resultado: ${updated ? 'exitoso' : 'fallido'}`);
          } catch (valetError) {
            console.error('Error al actualizar contador de visitas:', valetError);
            // No interrumpir el flujo si falla esta actualización
          }
        }
      }
    } catch (customerError) {
      console.error('Error updating customer last visit:', customerError);
    }

    return true;
  } catch (error) {
    console.error('Error storing ticket in Supabase:', error);

    // Fallback to local storage
    try {
      const now = new Date().toISOString();
      const ticketId = uuidv4();
      const ticketNumber = String(Math.floor(Math.random() * 10000000)).padStart(8, '0');

      const ticketToStore = {
        id: ticketId,
        ticketNumber: ticketNumber,
        clientName: customerData.name,
        phoneNumber: customerData.phoneNumber,
        totalPrice: ticketData.totalPrice,
        paymentMethod: ticketData.paymentMethod,
        valetQuantity: ticketData.valetQuantity,
        createdAt: now,
        status: TICKET_STATUS.READY, // Set to ready by default to show up in pickup page
        isPaid: ticketData.isPaidInAdvance || false,
        pendingSync: true,
        is_canceled: false, // Explicitly set is_canceled to false
        dryCleaningItems,
        laundryOptions
      };

      // Get existing tickets or initialize empty array
      const existingTicketsJson = localStorage.getItem('tickets');
      const existingTickets = existingTicketsJson ? JSON.parse(existingTicketsJson) : [];

      // Add new ticket
      existingTickets.push(ticketToStore);

      // Save back to localStorage
      localStorage.setItem('tickets', JSON.stringify(existingTickets));

      return true;
    } catch (localError) {
      console.error('Error storing ticket locally:', localError);
      return false;
    }
  }
};
