import { supabase } from '@/integrations/supabase/client';
import { Ticket, LaundryOption, DryCleaningItem } from '@/lib/types';
import { toast } from '@/lib/toast';
import { getNextTicketNumber } from '@/lib/dataService';
import { mapTicketData } from './ticketQueryUtils';

/**
 * Create a new ticket with complete details
 * @param ticketData The ticket data to create
 * @returns The created ticket ID if successful
 */
export const createTicket = async (ticketData: {
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  valetQuantity: number;
  dryCleaningItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  laundryOptions?: Array<{
    optionType: string;
  }>;
  customerId?: string;
}): Promise<string | null> => {
  try {
    // Get next ticket number
    const ticketNumber = await getNextTicketNumber();
    
    if (!ticketNumber) {
      toast.error('Error al obtener número de ticket');
      return null;
    }

    // First, create the ticket
    const { data: ticketResult, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        total: ticketData.totalPrice,
        payment_method: ticketData.paymentMethod,
        status: 'pending',
        is_paid: ticketData.isPaid,
        valet_quantity: ticketData.valetQuantity,
        customer_id: ticketData.customerId
      })
      .select('id')
      .single();

    if (ticketError) {
      console.error('Error creating ticket:', ticketError);
      toast.error('Error al crear el ticket');
      return null;
    }

    const ticketId = ticketResult.id;

    // Add dry cleaning items if any
    if (ticketData.dryCleaningItems && ticketData.dryCleaningItems.length > 0) {
      const dryCleaningItemsWithTicketId = ticketData.dryCleaningItems.map(item => ({
        ticket_id: ticketId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('dry_cleaning_items')
        .insert(dryCleaningItemsWithTicketId);

      if (itemsError) {
        console.error('Error adding dry cleaning items:', itemsError);
        // Continue anyway, the ticket has been created
      }
    }

    // Add laundry options if any
    if (ticketData.laundryOptions && ticketData.laundryOptions.length > 0) {
      const laundryOptionsWithTicketId = ticketData.laundryOptions.map(option => ({
        ticket_id: ticketId,
        option_type: option.optionType
      }));

      const { error: optionsError } = await supabase
        .from('ticket_laundry_options')
        .insert(laundryOptionsWithTicketId);

      if (optionsError) {
        console.error('Error adding laundry options:', optionsError);
        // Continue anyway, the ticket has been created
      }
    }

    // Return the ticket ID on success
    return ticketId;
  } catch (error) {
    console.error('Error creating ticket:', error);
    toast.error('Error al crear el ticket');
    return null;
  }
};

// Get ticket services (dry cleaning items)
export const getTicketServices = async (ticketId: string): Promise<any[]> => {
  if (!ticketId) return [];
  
  try {
    // Get dry cleaning items
    const { data: dryCleaningItems, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (dryCleaningError) {
      console.error('Error getting dry cleaning items:', dryCleaningError);
      return [];
    }
    
    return dryCleaningItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
      ticketId: item.ticket_id
    }));
  } catch (error) {
    console.error('Error in getTicketServices:', error);
    return [];
  }
};

// Get ticket options (laundry options)
export const getTicketOptions = async (ticketId: string): Promise<LaundryOption[]> => {
  if (!ticketId) return [];
  
  try {
    const { data, error } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (error) {
      console.error('Error getting ticket options:', error);
      return [];
    }
    
    // Map the database fields to the LaundryOption interface
    return data.map(option => ({
      id: option.id,
      name: option.option_type, // Use option_type as name
      optionType: option.option_type,
      type: option.option_type, // For backwards compatibility
      price: 0, // Laundry options don't have a price in our system
      ticketId: option.ticket_id,
      createdAt: option.created_at
    }));
  } catch (error) {
    console.error('Error in getTicketOptions:', error);
    return [];
  }
};

// Get full ticket with customer, items, and options
export const getFullTicket = async (ticketId: string): Promise<Ticket | null> => {
  try {
    // Get ticket with customer
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select(`
        *,
        customers (
          id, name, phone, loyalty_points, free_valets
        )
      `)
      .eq('id', ticketId)
      .single();
      
    if (ticketError) {
      console.error('Error getting ticket:', ticketError);
      return null;
    }
    
    // Get dry cleaning items
    const { data: dryCleaningItems, error: dryCleaningError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (dryCleaningError) {
      console.error('Error getting dry cleaning items:', dryCleaningError);
    }
    
    // Get laundry options
    const { data: laundryOptions, error: laundryError } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);
      
    if (laundryError) {
      console.error('Error getting laundry options:', laundryError);
    }
    
    // Create a base ticket object
    const baseTicket = mapTicketData(ticket);
    
    // Add the items and options
    const formattedItems: DryCleaningItem[] = dryCleaningItems?.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price || 0,
      ticketId: item.ticket_id
    })) || [];
    
    const formattedOptions: LaundryOption[] = laundryOptions?.map(option => ({
      id: option.id,
      name: option.option_type, // Use option_type as name
      optionType: option.option_type,
      type: option.option_type, // For backwards compatibility
      price: 0, // Laundry options don't have a price
      ticketId: option.ticket_id,
      createdAt: option.created_at
    })) || [];
    
    // Return the complete ticket with all data - using type assertion to handle adding dryCleaningItems
    return {
      ...baseTicket,
      dryCleaningItems: formattedItems,
      laundryOptions: formattedOptions
    } as Ticket;
  } catch (error) {
    console.error('Error in getFullTicket:', error);
    return null;
  }
};

// Cancel a ticket
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'canceled',
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error al cancelar el ticket');
      return false;
    }
    
    toast.success('Ticket cancelado exitosamente');
    return true;
  } catch (error) {
    console.error('Error in cancelTicket:', error);
    toast.error('Error al cancelar el ticket');
    return false;
  }
};

// Mark ticket as paid in advance
export const markTicketAsPaidInAdvance = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        is_paid: true,
        updated_at: new Date().toISOString() 
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as paid in advance:', error);
      toast.error('Error al marcar el ticket como pagado por adelantado');
      return false;
    }
    
    toast.success('Ticket marcado como pagado por adelantado');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsPaidInAdvance:', error);
    toast.error('Error al marcar el ticket como pagado por adelantado');
    return false;
  }
};
