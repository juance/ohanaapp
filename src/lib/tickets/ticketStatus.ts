
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mark a ticket as delivered
export const markTicketAsDelivered = async (ticketId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        status: 'delivered',
        is_paid: true, // Mark as paid when delivered
        delivered_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
      
    if (error) throw error;
    
    toast.success('Ticket marcado como entregado y pagado');
    return true;
  } catch (error) {
    console.error('Error marking ticket as delivered:', error);
    toast.error('Error al marcar el ticket como entregado');
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
