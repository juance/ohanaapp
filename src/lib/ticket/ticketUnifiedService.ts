/**
 * Ticket Unified Service
 *
 * This module provides a centralized interface for creating tickets,
 * combining the functionality of createTicket and storeTicket.
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { PaymentMethod, Ticket, LaundryOption } from '@/lib/types';
import { handleError } from '@/lib/utils/errorHandling';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { getCustomerByPhone, updateValetsCount, useFreeValet, addLoyaltyPoints } from '@/lib/data/customerService';
import { TICKET_STATUS } from '@/lib/constants/appConstants';
import { v4 as uuidv4 } from 'uuid';
import { updateCustomerLastVisit } from '@/lib/data/customer/customerStorageService';

/**
 * Interface for ticket creation parameters
 */
export interface TicketCreationParams {
  customerName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  valetQuantity?: number;
  useFreeValet?: boolean;
  services?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  laundryOptions?: LaundryOption[];
  isPaidInAdvance?: boolean;
}

/**
 * Interface for ticket creation result
 */
export interface TicketCreationResult {
  success: boolean;
  ticketId?: string;
  ticketNumber?: string;
  error?: string;
}

/**
 * Create a new ticket
 *
 * This function centralizes the ticket creation logic, replacing both
 * createTicket and storeTicket functions.
 *
 * @param params The ticket creation parameters
 * @returns A promise resolving to the ticket creation result
 */
export const createUnifiedTicket = async (params: TicketCreationParams): Promise<TicketCreationResult> => {
  try {
    console.log('Creating unified ticket with params:', JSON.stringify(params, null, 2));
    // Get the next ticket number
    console.log('Getting next ticket number');
    const ticketNumber = await getNextTicketNumber();
    console.log('Got ticket number:', ticketNumber);

    // Get or create customer
    console.log('Getting customer by phone:', params.phoneNumber);
    const customer = await getCustomerByPhone(params.phoneNumber);
    console.log('Customer found:', customer ? 'Yes' : 'No');
    let customerId = customer?.id;

    if (!customerId) {
      // Create new customer if not found
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: params.customerName,
          phone: params.phoneNumber,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0
        })
        .select('id')
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    } else {
      // Update customer's last visit
      await updateCustomerLastVisit(customerId);
    }

    // Handle loyalty program if applicable
    if (params.valetQuantity && params.valetQuantity > 0) {
      if (params.useFreeValet) {
        await useFreeValet(customerId);
      } else {
        await updateValetsCount(customerId, params.valetQuantity);
        await addLoyaltyPoints(customerId, Math.floor(params.totalPrice / 100));
      }
    }

    // Create the ticket
    const now = new Date().toISOString();
    const ticketId = uuidv4();
    console.log('Creating ticket with ID:', ticketId);

    const ticketData = {
      id: ticketId,
      ticket_number: ticketNumber,
      customer_id: customerId,
      total: params.totalPrice,
      payment_method: params.paymentMethod,
      status: TICKET_STATUS.READY, // Set status to READY by default so tickets appear in 'Pedidos Listos para Retirar'
      created_at: now,
      updated_at: now,
      is_paid: params.isPaidInAdvance || false,
      is_canceled: false,
      valet_quantity: params.valetQuantity || 0,
      date: now // Add date field which is required
    };

    console.log('Ticket data to insert:', JSON.stringify(ticketData, null, 2));

    const { error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketData);
    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      throw ticketError;
    } else {
      console.log('Ticket created successfully');
    }



    // Create ticket services if provided
    if (params.services && params.services.length > 0) {
      console.log('Creating ticket services:', JSON.stringify(params.services, null, 2));
      const serviceEntries = params.services.map(service => ({
        id: uuidv4(),
        ticket_id: ticketId,
        name: service.name,
        price: service.price,
        quantity: service.quantity
      }));

      const { error: servicesError } = await supabase
        .from('dry_cleaning_items')
        .insert(serviceEntries);

      if (servicesError) {
        console.error('Error creating ticket services:', servicesError);
        throw servicesError;
      } else {
        console.log('Ticket services created successfully');
      }
    }

    // Create ticket options if provided
    if (params.laundryOptions && params.laundryOptions.length > 0) {
      console.log('Creating ticket options:', JSON.stringify(params.laundryOptions, null, 2));
      const optionEntries = params.laundryOptions.map(option => ({
        id: uuidv4(),
        ticket_id: ticketId,
        option_type: option
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(optionEntries);

      if (optionsError) {
        console.error('Error creating ticket options:', optionsError);
        throw optionsError;
      } else {
        console.log('Ticket options created successfully');
      }
    }

    console.log('Ticket creation completed successfully');
    toast.success('Ticket creado exitosamente');

    return {
      success: true,
      ticketId,
      ticketNumber
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    handleError(error, 'Error al crear el ticket');

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * Get a ticket by ID
 * @param ticketId The ID of the ticket to retrieve
 * @returns A promise resolving to the ticket or null if not found
 */
export const getTicketById = async (ticketId: string): Promise<Ticket | null> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id,
        ticket_number,
        basket_ticket_number,
        total,
        payment_method,
        status,
        created_at,
        updated_at,
        is_paid,
        is_canceled,
        delivered_date,
        customer_id,
        customers (
          name,
          phone
        )
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Get ticket services
    const { data: servicesData, error: servicesError } = await supabase
      .from('dry_cleaning_items')
      .select('id, name, price, quantity')
      .eq('ticket_id', ticketId);

    if (servicesError) throw servicesError;

    // Get ticket options
    const { data: optionsData, error: optionsError } = await supabase
      .from('ticket_laundry_options')
      .select('option_type')
      .eq('ticket_id', ticketId);

    if (optionsError) throw optionsError;

    const customerData = data.customers || {};

    return {
      id: data.id,
      ticketNumber: data.ticket_number,
      basketTicketNumber: data.basket_ticket_number,
      clientName: customerData.name || '',
      phoneNumber: customerData.phone || '',
      services: servicesData || [],
      paymentMethod: data.payment_method as PaymentMethod,
      totalPrice: data.total,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      deliveredDate: data.delivered_date,
      isPaid: data.is_paid,
      options: optionsData ? optionsData.map(o => o.option_type) : []
    };
  } catch (error) {
    console.error('Error getting ticket by ID:', error);
    return null;
  }
};
