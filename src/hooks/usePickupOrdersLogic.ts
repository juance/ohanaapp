
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPickupTickets, cancelTicket, markTicketAsDelivered } from '@/lib/ticket/ticketPickupService';
import { getTicketServices } from '@/lib/ticketService';
import { Ticket } from '@/lib/types';

export const usePickupOrdersLogic = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // Fetch tickets
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: getPickupTickets,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    staleTime: 0 // Consider data stale immediately
  });

  // Filter tickets based on search query
  const filteredTickets = searchQuery.trim()
    ? tickets.filter((ticket: Ticket) => {
        if (searchFilter === 'name' && ticket.clientName) {
          return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchFilter === 'phone' && ticket.phoneNumber) {
          return ticket.phoneNumber.includes(searchQuery);
        }
        return false;
      })
    : tickets;

  // Load ticket services
  const loadTicketServices = async (ticketId: string) => {
    try {
      const services = await getTicketServices(ticketId);
      setTicketServices(services);
    } catch (error) {
      console.error('Error loading ticket services:', error);
      setTicketServices([]);
    }
  };

  // Handle mark as delivered
  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      await markTicketAsDelivered(ticketId);
      toast.success('Ticket marcado como entregado');
      setSelectedTicket(null);

      // Invalidate both pickup and delivered tickets queries
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      queryClient.invalidateQueries({ queryKey: ['deliveredTickets'] });

      // Refetch pickup tickets
      refetch();
    } catch (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error al marcar el ticket como entregado');
    }
  };

  // Handle cancel dialog open
  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  // Handle cancel ticket
  const handleCancelTicket = async () => {
    if (!selectedTicket || !cancelReason.trim()) {
      toast.error('Debe proporcionar un motivo para cancelar el ticket');
      return;
    }

    try {
      await cancelTicket(selectedTicket, cancelReason);
      toast.success('Ticket cancelado correctamente');
      setSelectedTicket(null);
      setCancelDialogOpen(false);
      setCancelReason('');
      refetch();
    } catch (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error al cancelar el ticket');
    }
  };

  // Handle print ticket
  const handlePrintTicket = (ticketId: string) => {
    console.log('Imprimir ticket:', ticketId);
    // Implementación de impresión
  };

  // Handle share WhatsApp
  const handleShareWhatsApp = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('El cliente no tiene número de teléfono registrado');
      return;
    }

    console.log('Compartir por WhatsApp:', ticketId, phoneNumber);
    // Implementación de compartir por WhatsApp
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  return {
    tickets,
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
    error,
    refetch,
    loadTicketServices,
    handleMarkAsDelivered,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleShareWhatsApp,
    formatDate
  };
};
