
import { useState, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, TicketService } from '@/lib/types';
import { toast } from '@/lib/toast';

// Tipos para el hook
interface TicketServiceWithDetails extends TicketService {
  services: any | null;
}

type SearchFilterType = 'name' | 'phone';

interface UsePickupOrdersLogicReturn {
  // Datos
  pickupTickets: Ticket[] | undefined;
  filteredTickets: Ticket[] | undefined;
  ticketServices: TicketServiceWithDetails[];

  // Estados
  selectedTicket: string | null;
  searchQuery: string;
  searchFilter: SearchFilterType;
  cancelDialogOpen: boolean;
  cancelReason: string;
  paymentMethodDialogOpen: boolean;

  // Referencias
  ticketDetailRef: React.RefObject<HTMLDivElement>;

  // Estado de la consulta
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Setters
  setSelectedTicket: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchFilter: (filter: SearchFilterType) => void;
  setCancelDialogOpen: (open: boolean) => void;
  setCancelReason: (reason: string) => void;
  setPaymentMethodDialogOpen: (open: boolean) => void;

  // Funciones
  refetch: () => Promise<any>;
  loadTicketServices: (ticketId: string) => Promise<void>;
  handleMarkAsDelivered: (ticketId: string) => Promise<void>;
  handleOpenCancelDialog: () => void;
  handleCancelTicket: () => Promise<void>;
  handlePrintTicket: (ticketId: string) => void;
  handleShareWhatsApp: (ticketId: string, phoneNumber?: string) => void;
  handleNotifyClient: (ticketId: string, phoneNumber?: string) => void;
  handleOpenPaymentMethodDialog: () => void;
  handleUpdatePaymentMethod: (paymentMethod: string) => Promise<void>;
  handleError: (err: any) => void;
  formatDate: (dateString: string) => string;
}

/**
 * Hook para manejar la lógica de los pedidos a retirar
 *
 * Este hook proporciona toda la funcionalidad necesaria para la pantalla de pedidos a retirar,
 * incluyendo la carga de tickets, filtrado, selección, y operaciones como marcar como entregado,
 * cancelar, etc.
 */
export const usePickupOrdersLogic = (): UsePickupOrdersLogicReturn => {
  // =========================================================================
  // Estados
  // =========================================================================

  // Estado para el ticket seleccionado
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>('name');

  // Estado para los servicios del ticket
  const [ticketServices, setTicketServices] = useState<TicketServiceWithDetails[]>([]);

  // Estado para el diálogo de cancelación
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Estado para el diálogo de método de pago
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);

  // Referencia para el panel de detalles del ticket
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // Funciones de utilidad
  // =========================================================================

  /**
   * Formatea una fecha en formato legible
   */
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch (e) {
      return dateString;
    }
  }, []);

  /**
   * Maneja errores de forma centralizada
   */
  const handleError = useCallback((err: any): void => {
    console.error("Error in usePickupOrdersLogic:", err);
    toast.error(`Error: ${err.message || 'Ha ocurrido un error inesperado'}`);
  }, []);

  // =========================================================================
  // Consultas a la base de datos
  // =========================================================================

  /**
   * Consulta para obtener los tickets pendientes de entrega
   */
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

      // Mapear los registros de la base de datos al modelo Ticket
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
    staleTime: 1000 * 60, // 1 minuto
    gcTime: 1000 * 60 * 5 // 5 minutos
  });

  // =========================================================================
  // Operaciones con tickets
  // =========================================================================

  /**
   * Carga los servicios asociados a un ticket
   */
  const loadTicketServices = useCallback(async (ticketId: string): Promise<void> => {
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
        setTicketServices(ticketServicesData as TicketServiceWithDetails[]);
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
        } as TicketServiceWithDetails;
      });

      setTicketServices(combinedData || []);
    } catch (err: any) {
      console.error('Error cargando servicios del ticket:', err);
      handleError(err);
      setTicketServices([]);
    }
  }, [handleError]);

  /**
   * Marca un ticket como entregado
   */
  const handleMarkAsDelivered = useCallback(async (ticketId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'delivered', delivered_date: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Ticket marcado como entregado');
      refetch(); // Actualizar la lista de tickets
    } catch (err: any) {
      toast.error(`Error al marcar como entregado: ${err.message}`);
      handleError(err);
    }
  }, [refetch, handleError]);

  /**
   * Abre el diálogo de cancelación
   */
  const handleOpenCancelDialog = useCallback((): void => {
    setCancelDialogOpen(true);
  }, []);

  /**
   * Cancela un ticket
   */
  const handleCancelTicket = useCallback(async (): Promise<void> => {
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
  }, [selectedTicket, cancelReason, refetch, handleError]);

  /**
   * Imprime un ticket (implementación pendiente)
   */
  const handlePrintTicket = useCallback((ticketId: string): void => {
    console.log('Imprimir ticket:', ticketId);
    toast.info('Función de impresión no implementada');
  }, []);

  /**
   * Comparte un ticket por WhatsApp
   */
  const handleShareWhatsApp = useCallback((ticketId: string, phoneNumber?: string): void => {
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
  }, [pickupTickets]);

  /**
   * Notifica al cliente (actualmente usa WhatsApp)
   */
  const handleNotifyClient = useCallback((ticketId: string, phoneNumber?: string): void => {
    handleShareWhatsApp(ticketId, phoneNumber);
  }, [handleShareWhatsApp]);

  /**
   * Abre el diálogo de método de pago
   */
  const handleOpenPaymentMethodDialog = useCallback((): void => {
    setPaymentMethodDialogOpen(true);
  }, []);

  /**
   * Actualiza el método de pago de un ticket
   */
  const handleUpdatePaymentMethod = useCallback(async (paymentMethod: string): Promise<void> => {
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
  }, [selectedTicket, refetch, handleError]);

  // =========================================================================
  // Filtrado de tickets
  // =========================================================================

  /**
   * Filtra los tickets basados en la búsqueda
   */
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
  // =========================================================================
  // Retorno del hook
  // =========================================================================
  return {
    // Datos
    pickupTickets,
    filteredTickets,
    ticketServices,

    // Estados
    selectedTicket,
    searchQuery,
    searchFilter,
    cancelDialogOpen,
    cancelReason,
    paymentMethodDialogOpen,

    // Referencias
    ticketDetailRef,

    // Estado de la consulta
    isLoading,
    isError,
    error,

    // Setters
    setSelectedTicket,
    setSearchQuery,
    setSearchFilter,
    setCancelDialogOpen,
    setCancelReason,
    setPaymentMethodDialogOpen,

    // Funciones
    refetch,
    loadTicketServices,
    handleMarkAsDelivered,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleShareWhatsApp,
    handleNotifyClient,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    handleError,
    formatDate
  };
};
