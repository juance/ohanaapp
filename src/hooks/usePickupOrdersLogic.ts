
import { useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';

export const usePickupOrdersLogic = () => {
  // State for the component
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // Fetch pickup tickets
  const {
    data: pickupTickets = [],
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

  // Filter tickets based on search query
  const filteredTickets = pickupTickets.filter(ticket => {
    if (!searchQuery.trim()) return true;
    
    if (searchFilter === 'name') {
      return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return ticket.phoneNumber.includes(searchQuery);
    }
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

  // Load ticket services
  const loadTicketServices = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_services')
        .select('*')
        .eq('ticket_id', ticketId);

      if (error) throw error;

      setTicketServices(data || []);
    } catch (err: any) {
      console.error('Error loading ticket services:', err);
      toast.error('Error al cargar servicios del ticket');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  // Handle opening cancel dialog
  const handleOpenCancelDialog = useCallback(() => {
    setCancelDialogOpen(true);
  }, []);

  // Handle cancel ticket
  const handleCancelTicket = useCallback(async () => {
    if (!selectedTicket || !cancelReason.trim()) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'cancelled',
          cancellation_reason: cancelReason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', selectedTicket);

      if (error) throw error;

      toast.success('Ticket cancelado');
      setCancelDialogOpen(false);
      setCancelReason('');
      refetch();
    } catch (err: any) {
      toast.error(`Error al cancelar ticket: ${err.message}`);
    }
  }, [selectedTicket, cancelReason, refetch]);

  // Handle print ticket
  const handlePrintTicket = useCallback(() => {
    if (!selectedTicket) return;
    toast.info('Imprimiendo ticket...');
    // Implement actual printing logic
  }, [selectedTicket]);

  // Handle share via WhatsApp
  const handleShareWhatsApp = useCallback(() => {
    if (!selectedTicket) return;
    
    const ticket = pickupTickets.find(t => t.id === selectedTicket);
    if (!ticket || !ticket.phoneNumber) {
      toast.error('No se puede compartir: el cliente no tiene número telefónico');
      return;
    }

    const message = `Hola ${ticket.clientName}, tu pedido #${ticket.ticketNumber} está listo para retirar.`;
    const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  }, [selectedTicket, pickupTickets]);

  // Handle notify client
  const handleNotifyClient = useCallback(() => {
    if (!selectedTicket) return;
    
    const ticket = pickupTickets.find(t => t.id === selectedTicket);
    if (!ticket) return;
    
    toast.success(`Cliente ${ticket.clientName} notificado`);
    // Implement actual notification logic
  }, [selectedTicket, pickupTickets]);

  // Handle payment method dialog
  const handleOpenPaymentMethodDialog = useCallback(() => {
    if (!selectedTicket) return;
    setPaymentMethodDialogOpen(true);
  }, [selectedTicket]);

  // Handle update payment method
  const handleUpdatePaymentMethod = useCallback(async (newMethod: string) => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ payment_method: newMethod })
        .eq('id', selectedTicket);

      if (error) throw error;

      toast.success('Método de pago actualizado');
      setPaymentMethodDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(`Error al actualizar método de pago: ${err.message}`);
    }
  }, [selectedTicket, refetch]);

  // Function to handle errors
  const handleError = (err: any) => {
    console.error("Error in usePickupOrdersLogic:", err);
    toast.error(`Error: ${err.message || 'Something went wrong'}`);
  };
  
  return {
    pickupTickets,
    filteredTickets,
    selectedTicket,
    setSelectedTicket,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    ticketServices,
    cancelDialogOpen,
    setCancelDialogOpen,
    cancelReason,
    setCancelReason,
    ticketDetailRef,
    isLoading,
    isError,
    error,
    refetch,
    loadTicketServices,
    handleMarkAsDelivered: markAsDelivered,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleShareWhatsApp,
    handleNotifyClient,
    paymentMethodDialogOpen,
    setPaymentMethodDialogOpen,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    formatDate,
    handleError
  };
};
