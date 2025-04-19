import { supabase } from '@/integrations/supabase/client';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { logError } from '@/lib/errorService';

export const getTicketServices = async (ticketId: string): Promise<{
  ticket: Ticket | null;
  dryCleaningItems: DryCleaningItem[];
  laundryOptions: LaundryOption[];
} | null> => {
  try {
    // First get the ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();
    
    if (ticketError) {
      console.error('Error retrieving ticket from Supabase:', ticketError);
      logError(ticketError, { context: 'getTicketServices - retrieving ticket' });
      return null;
    }
    
    if (!ticketData) {
      console.log('Ticket not found:', ticketId);
      return null;
    }
    
    // Then get the dry cleaning items
    const { data: dryCleaningItemsData, error: dryCleaningItemsError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (dryCleaningItemsError) {
      console.error('Error retrieving dry cleaning items from Supabase:', dryCleaningItemsError);
      logError(dryCleaningItemsError, { context: 'getTicketServices - retrieving dry cleaning items' });
      return null;
    }
    
    // Finally get the laundry options
    const { data: laundryOptionsData, error: laundryOptionsError } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (laundryOptionsError) {
      console.error('Error retrieving laundry options from Supabase:', laundryOptionsError);
      logError(laundryOptionsError, { context: 'getTicketServices - retrieving laundry options' });
      return null;
    }
    
    // Map the data to the correct types
    const ticket: Ticket = {
      id: ticketData.id,
      ticketNumber: ticketData.ticket_number,
      customerId: ticketData.customer_id,
      totalPrice: ticketData.total,
      paymentMethod: ticketData.payment_method,
      status: ticketData.status,
      isPaid: ticketData.is_paid,
      createdAt: ticketData.created_at,
      valetQuantity: ticketData.valet_quantity,
      date: ticketData.date,
      deliveredDate: ticketData.delivered_date,
      isCanceled: ticketData.is_canceled,
      cancelReason: ticketData.cancel_reason,
      paymentAmount: ticketData.payment_amount,
      paymentStatus: ticketData.payment_status,
      basketTicketNumber: ticketData.basket_ticket_number,
      updatedAt: ticketData.updated_at
    };
    
    const dryCleaningItems: DryCleaningItem[] = dryCleaningItemsData.map((item) => ({
      id: item.id,
      ticketId: item.ticket_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.created_at
    }));
    
    const laundryOptions: LaundryOption[] = laundryOptionsData.map((option) => ({
      id: option.id,
      ticketId: option.ticket_id,
      name: option.option_type,
      optionType: option.option_type,
      createdAt: option.created_at
    }));
    
    return {
      ticket,
      dryCleaningItems,
      laundryOptions
    };
  } catch (error) {
    console.error('Error in getTicketServices:', error);
    logError(error, { context: 'getTicketServices' });
    return null;
  }
};

export const getTicketOptions = async (ticketId: string): Promise<{
  dryCleaningItems: DryCleaningItem[];
  laundryOptions: LaundryOption[];
} | null> => {
  try {
    // Then get the dry cleaning items
    const { data: dryCleaningItemsData, error: dryCleaningItemsError } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (dryCleaningItemsError) {
      console.error('Error retrieving dry cleaning items from Supabase:', dryCleaningItemsError);
      logError(dryCleaningItemsError, { context: 'getTicketOptions - retrieving dry cleaning items' });
      return null;
    }
    
    // Finally get the laundry options
    const { data: laundryOptionsData, error: laundryOptionsError } = await supabase
      .from('ticket_laundry_options')
      .select('*')
      .eq('ticket_id', ticketId);
    
    if (laundryOptionsError) {
      console.error('Error retrieving laundry options from Supabase:', laundryOptionsError);
      logError(laundryOptionsError, { context: 'getTicketOptions - retrieving laundry options' });
      return null;
    }
    
    const dryCleaningItems: DryCleaningItem[] = dryCleaningItemsData.map((item) => ({
      id: item.id,
      ticketId: item.ticket_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      createdAt: item.created_at
    }));
    
    const laundryOptions: LaundryOption[] = laundryOptionsData.map((option) => ({
      id: option.id,
      ticketId: option.ticket_id,
      name: option.option_type,
      optionType: option.option_type,
      createdAt: option.created_at
    }));
    
    return {
      dryCleaningItems,
      laundryOptions
    };
  } catch (error) {
    console.error('Error in getTicketOptions:', error);
    logError(error, { context: 'getTicketOptions' });
    return null;
  }
};

export const markTicketAsPaidInAdvance = async (ticketId: string): Promise<boolean> => {
  try {
    if (!ticketId) {
      throw new Error('Ticket ID is required');
    }
    
    const { error } = await supabase
      .from('tickets')
      .update({
        payment_status: 'paid'
      })
      .eq('id', ticketId);
    
    if (error) {
      console.error('Error marking ticket as paid in advance:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking ticket as paid in advance:', error);
    return false;
  }
};
