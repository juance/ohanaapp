
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';
import { useState, useRef } from 'react';

export const usePickupOrdersLogic = () => {
  // Estado para el ticket seleccionado
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');

  // Estado para los servicios del ticket
  const [ticketServices, setTicketServices] = useState<any[]>([]);

  // Estado para el diálogo de cancelación
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Estado para el diálogo de método de pago
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);

  // Referencia para el panel de detalles del ticket
  const ticketDetailRef = useRef<HTMLDivElement>(null);
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch (e) {
      return dateString;
    }
  };

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
  const handleMarkAsDelivered = async (ticketId: string) => {
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

  // Función para cargar los servicios de un ticket
  const loadTicketServices = async (ticketId: string) => {
    try {
      // Primero obtenemos los servicios del ticket
      const { data: ticketServicesData, error: ticketServicesError } = await supabase
        .from('ticket_services')
        .select('*')
        .eq('ticket_id', ticketId);

      if (ticketServicesError) throw ticketServicesError;

      // Si no hay servicios, devolvemos un array vacío
      if (!ticketServicesData || ticketServicesData.length === 0) {
        setTicketServices([]);
        return;
      }

      // Obtenemos los IDs de los servicios
      const serviceIds = ticketServicesData.map(ts => ts.service_id).filter(Boolean);

      // Si no hay IDs de servicios, devolvemos los datos de ticket_services tal cual
      if (serviceIds.length === 0) {
        setTicketServices(ticketServicesData);
        return;
      }

      // Obtenemos los detalles de los servicios
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .in('id', serviceIds);

      if (servicesError) throw servicesError;

      // Combinamos los datos
      const combinedData = ticketServicesData.map(ts => {
        const service = servicesData?.find(s => s.id === ts.service_id) || null;
        return {
          ...ts,
          services: service
        };
      });

      setTicketServices(combinedData || []);
    } catch (err: any) {
      console.error('Error cargando servicios del ticket:', err);
      handleError(err);
      setTicketServices([]);
    }
  };

  // Función para abrir el diálogo de cancelación
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  // Función para cancelar un ticket
  const handleCancelTicket = async () => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'cancelled', cancel_reason: cancelReason })
        .eq('id', selectedTicket);

      if (error) throw error;

      toast.success('Ticket cancelado correctamente');
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedTicket(null);
      refetch();
    } catch (err: any) {
      handleError(err);
    }
  };

  // Función para imprimir un ticket
  const handlePrintTicket = (ticketId: string) => {
    // Implementación pendiente
    console.log('Imprimir ticket:', ticketId);
    toast.info('Función de impresión no implementada');
  };

  // Función para compartir por WhatsApp
  const handleShareWhatsApp = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('No hay número de teléfono para este cliente');
      return;
    }

    const ticket = pickupTickets?.find(t => t.id === ticketId);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    const message = `Hola! Tu pedido #${ticket.ticketNumber} está listo para retirar. Total: $${ticket.totalPrice}. Gracias por tu compra!`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Función para notificar al cliente
  const handleNotifyClient = (ticketId: string, phoneNumber?: string) => {
    // Por ahora, redirigimos a la función de WhatsApp
    handleShareWhatsApp(ticketId, phoneNumber);
  };

  // Función para abrir el diálogo de método de pago
  const handleOpenPaymentMethodDialog = () => {
    setPaymentMethodDialogOpen(true);
  };

  // Función para actualizar el método de pago
  const handleUpdatePaymentMethod = async (paymentMethod: string) => {
    if (!selectedTicket) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({ payment_method: paymentMethod })
        .eq('id', selectedTicket);

      if (error) throw error;

      toast.success('Método de pago actualizado correctamente');
      setPaymentMethodDialogOpen(false);
      refetch();
    } catch (err: any) {
      handleError(err);
    }
  };

  // Filtrar tickets basados en la búsqueda
  const filteredTickets = searchQuery.trim()
    ? pickupTickets?.filter((ticket) => {
        if (searchFilter === 'name' && ticket.clientName) {
          return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchFilter === 'phone' && ticket.phoneNumber) {
          return ticket.phoneNumber.includes(searchQuery);
        }
        return false;
      })
    : pickupTickets;
<<<<<<< HEAD

=======
>>>>>>> d57c03af09d39f8ef4d6f67f524793f24e069d31
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
    handleMarkAsDelivered,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleShareWhatsApp,
    handleNotifyClient,
    paymentMethodDialogOpen,
    setPaymentMethodDialogOpen,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    handleError,
    formatDate
  };
};
