
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { PaymentMethod } from '../types';
import { handleError } from '../utils/errorHandling';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { getCustomerByPhone, updateValetsCount, useFreeValet, addLoyaltyPoints } from '@/lib/data/customerService';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Create a new ticket in the database
 */
export const createTicket = async ({
  customerName,
  phoneNumber,
  totalPrice,
  paymentMethod,
  valetQuantity = 0,
  isPaidInAdvance = false,
  usesFreeValet = false,
  customDate,
  services = [],
  options = []
}: {
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  valetQuantity?: number;
  isPaidInAdvance?: boolean;
  usesFreeValet?: boolean;
  customDate?: Date;
  services?: Array<{ name: string; quantity: number; price: number }>;
  options?: string[];
}): Promise<{ success: boolean; ticketId?: string; ticketNumber?: string }> => {
  try {
    // Step 1: Get or create customer
    const customer = await getCustomerByPhone(phoneNumber);
    let customerId: string;

    if (customer) {
      customerId = customer.id;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customerName,
          phone: phoneNumber,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0
        })
        .select('id')
        .single();

      if (customerError || !newCustomer) {
        throw new Error(`Failed to create customer: ${customerError?.message || 'Unknown error'}`);
      }

      customerId = newCustomer.id;
    }

    // Step 2: Handle free valet if applicable
    if (usesFreeValet) {
      const success = await useFreeValet(customerId);
      if (!success) {
        throw new Error('Client has no free valets available');
      }
    }
    // If not using free valet and there are valets, update count and add loyalty points
    else if (valetQuantity > 0) {
      await updateValetsCount(customerId, valetQuantity);

      // Add loyalty points (10 points per valet)
      const pointsToAdd = valetQuantity * 10;
      if (pointsToAdd > 0) {
        await addLoyaltyPoints(customerId, pointsToAdd);
      }
    }

    // Step 3: Get next ticket number and create ticket
    const ticketNumber = await getNextTicketNumber();
    const ticketDate = customDate ? customDate.toISOString() : new Date().toISOString();

    // Get the next basket ticket number
    const { data: basketCountData } = await supabase
      .from('tickets')
      .select('basket_ticket_number')
      .order('created_at', { ascending: false })
      .limit(1);

    let basketTicketNumber = "1";
    if (basketCountData && basketCountData.length > 0) {
      const lastBasketNumber = parseInt(basketCountData[0].basket_ticket_number || "0");
      basketTicketNumber = (lastBasketNumber + 1).toString();
    }

    // Insert ticket with 'ready' status by default
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        total: totalPrice,
        payment_method: paymentMethod,
        valet_quantity: valetQuantity,
        customer_id: customerId,
        status: TICKET_STATUS.READY, // Set status to ready by default
        date: ticketDate,
        created_at: ticketDate,
        is_paid: isPaidInAdvance || false,
        basket_ticket_number: basketTicketNumber
      })
      .select('*')
      .single();

    if (ticketError || !ticketData) {
      throw new Error(`Failed to create ticket: ${ticketError?.message || 'Unknown error'}`);
    }

    // Step 4: Add services (dry cleaning items) if any
    if (services.length > 0) {
      const itemsToInsert = services.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        ticket_id: ticketData.id
      }));

      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(itemsToInsert);

      if (itemsError) {
        handleError(itemsError, 'createTicket:insertServices', 'Error al guardar servicios');
      }
    }

    // Step 5: Add laundry options if any
    if (options.length > 0) {
      const optionsToInsert = options.map(option => ({
        ticket_id: ticketData.id,
        option_type: option
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(optionsToInsert);

      if (optionsError) {
        handleError(optionsError, 'createTicket:insertOptions', 'Error al guardar opciones');
      }
    }

    toast.success('Ticket creado exitosamente');
    return {
      success: true,
      ticketId: ticketData.id,
      ticketNumber: ticketData.ticket_number
    };
  } catch (error) {
    handleError(error, 'createTicket', 'Error al crear el ticket');
    return { success: false };
  }
};
