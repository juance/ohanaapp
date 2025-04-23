
import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { toast } from '@/lib/toast';

// Get ticket services (dry cleaning items and laundry options)
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
      price: 0, // Laundry options don't have a price in our system
      ticketId: option.ticket_id,
      optionType: option.option_type,
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
    
    // Format the ticket object
    const formattedTicket: Ticket = {
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      customerId: ticket.customer_id,
      clientName: ticket.customers?.name || 'Unknown',
      phoneNumber: ticket.customers?.phone || 'N/A',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'pending',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date,
      dryCleaningItems: dryCleaningItems?.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
        ticketId: item.ticket_id
      })) || [],
      laundryOptions: laundryOptions?.map(option => ({
        id: option.id,
        name: option.option_type, // Use option_type as name
        price: 0, // Laundry options don't have a price
        ticketId: option.ticket_id,
        optionType: option.option_type, 
        createdAt: option.created_at
      })) || []
    };
    
    return formattedTicket;
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
