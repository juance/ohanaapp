
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';

export const usePickupOrdersLogic = () => {
  // Fetch pickup tickets
  const {
    data: pickupTickets,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: async (): Promise<Ticket[]> => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, customers(name, phone)')
        .in('status', ['ready', 'processing', 'pending'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database records to Ticket model
      return data.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
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
    },
    meta: {
      onError: (error: Error) => {
        toast.error(`Error cargando tickets: ${error.message}`);
      }
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5 // 5 minutes
  });

  // Function to mark a ticket as delivered
  const markAsDelivered = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'delivered', delivered_date: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket marcado como entregado');
      refetch(); // Refresh the ticket list
    } catch (err: any) {
      toast.error(`Error al marcar como entregado: ${err.message}`);
    }
  };

  // Function to handle errors
  const handleError = (err: any) => {
    console.error("Error in usePickupOrdersLogic:", err);
    toast.error(`Error: ${err.message || 'Something went wrong'}`);
  };
  
  return {
    pickupTickets,
    isLoading,
    isError,
    error,
    refetch,
    markAsDelivered,
    handleError
  };
};
