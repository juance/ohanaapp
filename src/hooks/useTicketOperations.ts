
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPickupTickets, getTicketServices, cancelTicket, markTicketAsDelivered } from '@/lib/ticket';
import { toast } from '@/hooks/use-toast';
import { Ticket } from '@/lib/types';
import { 
  handleNotifyClient, 
  handleShareWhatsApp, 
  generatePrintContent 
} from '@/components/pickup/ticketActionUtils';

interface UseTicketOperationsOptions {
  queryKey: string[];
  fetchFunction: () => Promise<Ticket[]>;
}

export const useTicketOperations = ({ queryKey, fetchFunction }: UseTicketOperationsOptions) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  
  const { 
    data: tickets = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey,
    queryFn: fetchFunction,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    } else {
      setTicketServices([]);
    }
  }, [selectedTicket]);

  const loadTicketServices = async (ticketId: string) => {
    setIsLoadingServices(true);
    setServiceError(null);
    
    try {
      const services = await getTicketServices(ticketId);
      setTicketServices(services);
    } catch (error) {
      console.error('Error loading ticket services:', error);
      setServiceError(error instanceof Error ? error : new Error('Failed to load ticket services'));
      setTicketServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleOpenCancelDialog = useCallback(() => {
    if (!selectedTicket) {
      toast.error('Error', { description: 'Seleccione un ticket primero' });
      return;
    }
    setCancelReason('');
    setCancelDialogOpen(true);
  }, [selectedTicket]);

  const handleCancelTicket = async () => {
    if (!selectedTicket) return;
    
    if (!cancelReason.trim()) {
      toast.error('Error', { description: 'Por favor ingrese un motivo para anular el ticket' });
      return;
    }

    try {
      const success = await cancelTicket(selectedTicket, cancelReason);
      if (success) {
        setCancelDialogOpen(false);
        setSelectedTicket(null);
        await queryClient.invalidateQueries({ queryKey });
        refetch();
      }
    } catch (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error', { 
        description: 'Hubo un problema al anular el ticket. Por favor, intente de nuevo.' 
      });
    }
  };

  const handlePrintTicket = () => {
    if (!selectedTicket) {
      toast.error('Error', { description: 'Seleccione un ticket primero' });
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Error', { description: 'Ticket no encontrado' });
      return;
    }

    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Error', { description: 'El navegador bloqueó la apertura de la ventana de impresión' });
        return;
      }

      printWindow.document.write(generatePrintContent(ticket, ticketServices));
      
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
      };
      
      toast.success('Preparando impresión del ticket');
    } catch (error) {
      console.error('Error printing ticket:', error);
      toast.error('Error', { description: 'Error al generar la impresión' });
    }
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      const success = await markTicketAsDelivered(ticketId);
      if (success) {
        setSelectedTicket(null);
        await queryClient.invalidateQueries({ queryKey });
        refetch();
        toast.success('Ticket marcado como entregado y pagado exitosamente');
      }
    } catch (error) {
      console.error('Error marking ticket as delivered:', error);
      toast.error('Error', { 
        description: 'Hubo un problema al marcar el ticket como entregado. Por favor, intente de nuevo.' 
      });
    }
  };

  // This function can be used for both pickup and delivered pages
  const filterTickets = (searchQuery: string, searchFilter: 'name' | 'phone') => {
    if (!searchQuery.trim()) return tickets;
    
    return tickets.filter(ticket => {
      if (searchFilter === 'name') {
        return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      } else { // 'phone'
        return ticket.phoneNumber.includes(searchQuery);
      }
    });
  };

  return {
    tickets,
    isLoading,
    error,
    refetch,
    selectedTicket,
    setSelectedTicket,
    ticketServices,
    isLoadingServices,
    serviceError,
    cancelDialogOpen,
    setCancelDialogOpen,
    cancelReason,
    setCancelReason,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleMarkAsDelivered,
    filterTickets,
  };
};
