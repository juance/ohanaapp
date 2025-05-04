
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { getNextStatus } from './ticketStatusService';

/**
 * Mark a ticket as ready for pickup
 */
export const markTicketAsReady = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'ready',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as ready:', error);
      toast.error('Error al marcar el ticket como listo para retirar');
      return false;
    }
    
    toast.success('Ticket marcado como listo para retirar');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsReady:', error);
    toast.error('Error al marcar el ticket como listo');
    return false;
  }
};

/**
 * Mark a ticket as delivered
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'delivered',
        delivered_date: new Date().toISOString(),
        is_paid: true, // Assuming payment happens on delivery
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error al marcar el ticket como entregado');
      return false;
    }
    
    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsDelivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Mark a ticket as processing
 */
export const markTicketAsProcessing = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as processing:', error);
      toast.error('Error al marcar el ticket como en proceso');
      return false;
    }
    
    toast.success('Ticket marcado como en proceso');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsProcessing:', error);
    toast.error('Error al marcar el ticket como en proceso');
    return false;
  }
};

/**
 * Mark a ticket as pending
 */
export const markTicketAsPending = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error marking ticket as pending:', error);
      toast.error('Error al marcar el ticket como pendiente');
      return false;
    }
    
    toast.success('Ticket marcado como pendiente');
    return true;
  } catch (error) {
    console.error('Error in markTicketAsPending:', error);
    toast.error('Error al marcar el ticket como pendiente');
    return false;
  }
};

/**
 * Cancel a ticket
 */
export const cancelTicket = async (ticketId: string, cancelReason: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status: 'cancelled',
        is_canceled: true,
        cancel_reason: cancelReason,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) {
      console.error('Error cancelling ticket:', error);
      toast.error('Error al cancelar el ticket');
      return false;
    }
    
    toast.success('Ticket cancelado correctamente');
    return true;
  } catch (error) {
    console.error('Error in cancelTicket:', error);
    toast.error('Error al cancelar el ticket');
    return false;
  }
};

/**
 * Move ticket to next status
 */
export const moveToNextStatus = async (ticketId: string, currentStatus: string): Promise<boolean> => {
  const nextStatus = getNextStatus(currentStatus);
  
  // If there's no state change, don't do anything
  if (nextStatus === currentStatus) {
    return false;
  }
  
  try {
    const updateData: Record<string, any> = { 
      status: nextStatus,
      updated_at: new Date().toISOString()
    };
    
    // If moving to delivered, also set delivered_date
    if (nextStatus === 'delivered') {
      updateData.delivered_date = new Date().toISOString();
      updateData.is_paid = true;
    }
    
    const { error } = await supabase
      .from('tickets')
      .update(updateData)
      .eq('id', ticketId);
      
    if (error) {
      console.error(`Error moving ticket to ${nextStatus}:`, error);
      toast.error(`Error al cambiar el estado del ticket a ${nextStatus}`);
      return false;
    }
    
    toast.success(`Ticket actualizado a estado: ${nextStatus}`);
    return true;
  } catch (error) {
    console.error(`Error in moveToNextStatus:`, error);
    toast.error(`Error al actualizar el estado del ticket`);
    return false;
  }
};
