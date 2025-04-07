import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { Ticket, PaymentMethod } from '../types';

// Get ticket services (dry cleaning items) with immediate default values
export const getTicketServices = async (ticketId: string) => {
  // Return an empty default state immediately
  const defaultServices = [];

  try {
    // First, check if this is a valet ticket
    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('valet_quantity, total')
      .eq('id', ticketId)
      .single();

    if (ticketError) {
      console.error('Error fetching ticket data:', ticketError);
      return defaultServices;
    }

    // If it has valet_quantity > 0, add it as a service
    if (ticketData && ticketData.valet_quantity > 0) {
      return [{
        name: 'Valet',
        price: ticketData.total / ticketData.valet_quantity,
        quantity: ticketData.valet_quantity
      }];
    }

    // Otherwise look for dry cleaning items
    const { data, error } = await supabase
      .from('dry_cleaning_items')
      .select('*')
      .eq('ticket_id', ticketId);

    if (error) {
      console.error('Error fetching ticket services:', error);
      return defaultServices;
    }

    // Only return populated data if we have items
    if (data && data.length > 0) {
      return data.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
    }

    return defaultServices;
  } catch (error) {
    console.error('Error fetching ticket services:', error);
    return defaultServices;
  }
};

// Get laundry options for a ticket
export const getTicketOptions = async (ticketId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('ticket_laundry_options')
      .select('option_type')
      .eq('ticket_id', ticketId);

    if (error) throw error;
    
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(item => item.option_type);
  } catch (error) {
    console.error('Error fetching ticket options:', error);
    return [];
  }
};

// Cancel a ticket
export const cancelTicket = async (ticketId: string, reason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_canceled: true,
        cancel_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket anulado correctamente');
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    toast.error('Error al anular el ticket');
    return false;
  }
};

// Mark a ticket as paid in advance
export const markTicketAsPaidInAdvance = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        is_paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como pagado por adelantado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as paid:', error);
    toast.error('Error al marcar el ticket como pagado');
    return false;
  }
};
