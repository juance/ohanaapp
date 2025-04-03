
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
    const services = await getTicketServices(ticketId);
    setTicketServices(services);
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

    const success = await cancelTicket(selectedTicket, cancelReason);
    if (success) {
      setCancelDialogOpen(false);
      setSelectedTicket(null);
      queryClient.invalidateQueries({ queryKey });
      refetch();
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
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    const success = await markTicketAsDelivered(ticketId);
    if (success) {
      setSelectedTicket(null);
      queryClient.invalidateQueries({ queryKey });
      refetch();
      toast.success('Ticket marcado como entregado y pagado exitosamente');
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
