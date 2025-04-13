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
    // Get the next ticket number
    const ticketNumber = await getNextTicketNumber();
    
    // Get or create customer
    const customer = await getCustomerByPhone(params.phoneNumber);
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
    
    const { error: ticketError } = await supabase
      .from('tickets')
      .insert({
        id: ticketId,
        ticket_number: ticketNumber,
        customer_id: customerId,
        total: params.totalPrice,
        payment_method: params.paymentMethod,
        status: TICKET_STATUS.PENDING, // Use the new initial status
        created_at: now,
        updated_at: now,
        is_paid: params.isPaidInAdvance || false,
        is_canceled: false,
        valet_quantity: params.valetQuantity || 0
      });
    
    if (ticketError) throw ticketError;
    
    // Create ticket services if provided
    if (params.services && params.services.length > 0) {
      const serviceEntries = params.services.map(service => ({
        id: uuidv4(),
        ticket_id: ticketId,
        name: service.name,
        price: service.price,
        quantity: service.quantity
      }));
      
      const { error: servicesError } = await supabase
        .from('ticket_services')
        .insert(serviceEntries);
      
      if (servicesError) throw servicesError;
    }
    
    // Create ticket options if provided
    if (params.laundryOptions && params.laundryOptions.length > 0) {
      const optionEntries = params.laundryOptions.map(option => ({
        id: uuidv4(),
        ticket_id: ticketId,
        option_name: option
      }));
      
      const { error: optionsError } = await supabase
        .from('ticket_options')
        .insert(optionEntries);
      
      if (optionsError) throw optionsError;
    }
    
    toast.success('Ticket creado exitosamente');
    
    return {
      success: true,
      ticketId,
      ticketNumber
    };
  } catch (error) {
    console.error('Error creating ticket:', error);
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
      .from('ticket_services')
      .select('id, name, price, quantity')
      .eq('ticket_id', ticketId);
    
    if (servicesError) throw servicesError;
    
    // Get ticket options
    const { data: optionsData, error: optionsError } = await supabase
      .from('ticket_options')
      .select('option_name')
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
      options: optionsData ? optionsData.map(o => o.option_name) : []
    };
  } catch (error) {
    console.error('Error getting ticket by ID:', error);
    return null;
  }
};
