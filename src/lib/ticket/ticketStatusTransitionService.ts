
/**
 * Ticket Status Transition Service
 * 
 * This module provides functions to transition tickets between different states
 * according to the ticket workflow.
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Mark a ticket as processing (in progress)
 * @param ticketId The ID of the ticket to update
 * @returns Promise resolving to true if successful, false otherwise
 */
export const markTicketAsProcessing = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.PROCESSING,
        updated_at: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como en proceso');
    return true;
  } catch (error) {
    console.error('Error marking ticket as processing:', error);
    toast.error('Error al marcar el ticket como en proceso');
    return false;
  }
};

/**
 * Mark a ticket as ready for pickup
 * @param ticketId The ID of the ticket to update
 * @returns Promise resolving to true if successful, false otherwise
 */
export const markTicketAsReady = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.READY,
        updated_at: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como listo para retirar');
    return true;
  } catch (error) {
    console.error('Error marking ticket as ready:', error);
    toast.error('Error al marcar el ticket como listo para retirar');
    return false;
  }
};

/**
 * Mark a ticket as delivered
 * @param ticketId The ID of the ticket to update
 * @returns Promise resolving to true if successful, false otherwise
 */
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.DELIVERED,
        delivered_date: now,
        is_paid: true,
        updated_at: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como entregado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
    return false;
  }
};

/**
 * Mark a ticket as pending (reset to initial state)
 * @param ticketId The ID of the ticket to update
 * @returns Promise resolving to true if successful, false otherwise
 */
export const markTicketAsPending = async (ticketId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: TICKET_STATUS.PENDING,
        updated_at: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket marcado como pendiente');
    return true;
  } catch (error) {
    console.error('Error marking ticket as pending:', error);
    toast.error('Error al marcar el ticket como pendiente');
    return false;
  }
};

/**
 * Cancel a ticket
 * @param ticketId The ID of the ticket to cancel
 * @param cancelReason The reason for cancellation
 * @returns Promise resolving to true if successful, false otherwise
 */
export const cancelTicket = async (ticketId: string, cancelReason: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'canceled',
        is_canceled: true,
        cancel_reason: cancelReason,
        updated_at: now
      })
      .eq('id', ticketId);

    if (error) throw error;

    toast.success('Ticket cancelado correctamente');
    return true;
  } catch (error) {
    console.error('Error canceling ticket:', error);
    toast.error('Error al cancelar el ticket');
    return false;
  }
};

/**
 * Get the next status in the workflow
 * @param currentStatus The current status of the ticket
 * @returns The next status in the workflow, or null if there is no next status
 */
export const getNextStatus = (currentStatus: string): string | null => {
  switch (currentStatus) {
    case TICKET_STATUS.PENDING:
      return TICKET_STATUS.PROCESSING;
    case TICKET_STATUS.PROCESSING:
      return TICKET_STATUS.READY;
    case TICKET_STATUS.READY:
      return TICKET_STATUS.DELIVERED;
    default:
      return null;
  }
};

/**
 * Move a ticket to the next status in the workflow
 * @param ticketId The ID of the ticket to update
 * @param currentStatus The current status of the ticket
 * @returns Promise resolving to true if successful, false otherwise
 */
export const moveToNextStatus = async (ticketId: string, currentStatus: string): Promise<boolean> => {
  const nextStatus = getNextStatus(currentStatus);
  
  if (!nextStatus) {
    toast.error('No hay un siguiente estado disponible');
    return false;
  }
  
  try {
    const now = new Date().toISOString();
    const updates: any = {
      status: nextStatus,
      updated_at: now
    };
    
    // If moving to delivered, also mark as paid and set delivered_date
    if (nextStatus === TICKET_STATUS.DELIVERED) {
      updates.is_paid = true;
      updates.delivered_date = now;
    }
    
    const { error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticketId);
    
    if (error) throw error;
    
    const statusMessages = {
      [TICKET_STATUS.PROCESSING]: 'Ticket marcado como en proceso',
      [TICKET_STATUS.READY]: 'Ticket marcado como listo para retirar',
      [TICKET_STATUS.DELIVERED]: 'Ticket marcado como entregado'
    };
    
    toast.success(statusMessages[nextStatus] || 'Estado del ticket actualizado');
    return true;
  } catch (error) {
    console.error('Error moving ticket to next status:', error);
    toast.error('Error al actualizar el estado del ticket');
    return false;
  }
};
