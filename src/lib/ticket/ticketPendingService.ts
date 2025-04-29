
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';

// Create or export the getDatabaseStatuses function
export const getDatabaseStatuses = () => {
  return ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
};

export const getProcessingTickets = async (): Promise<Ticket[]> => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers(name, phone)')
      .in('status', ['processing', 'pending']) // Use array directly here
      .order('created_at', { ascending: false });
      
    if (error) throw error;

    return data.map((ticket: any) => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number || '000',
      clientName: ticket.customers?.name || 'Cliente',
      phoneNumber: ticket.customers?.phone || '',
      totalPrice: ticket.total || 0,
      paymentMethod: ticket.payment_method || 'cash',
      status: ticket.status || 'pending',
      isPaid: ticket.is_paid || false,
      valetQuantity: ticket.valet_quantity || 0,
      createdAt: ticket.created_at,
      deliveredDate: ticket.delivered_date
    }));
  } catch (error) {
    console.error('Error fetching processing tickets:', error);
    toast.error('Error al cargar los tickets en proceso');
    return [];
  }
};
