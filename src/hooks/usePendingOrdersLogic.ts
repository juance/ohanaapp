
import { useState, useRef } from 'react';
import { Ticket } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketServices } from '@/lib/ticketService';
import { getProcessingTickets, getPendingTickets, getReadyTickets } from '@/lib/ticket/ticketPendingService';
import { markTicketAsReady, markTicketAsDelivered } from '@/lib/ticket/ticketStatusTransitionService';
import { toast } from '@/lib/toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TicketService {
  name: string;
  quantity?: number;
}

export const usePendingOrdersLogic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketServices, setTicketServices] = useState<TicketService[]>([]);
  const queryClient = useQueryClient();
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  const { data: processingTickets = [], isLoading: processingLoading, refetch: refetchProcessing } = useQuery({
    queryKey: ['processingTickets'],
    queryFn: () => getProcessingTickets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  const { data: pendingTickets = [], isLoading: pendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['pendingTickets'],
    queryFn: () => getPendingTickets(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const { data: readyTickets = [], isLoading: readyLoading, refetch: refetchReady } = useQuery({
    queryKey: ['readyTickets'],
    queryFn: () => getReadyTickets(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });

  const isLoading = processingLoading || pendingLoading || readyLoading;

  const loadTicketServices = async (ticketId: string) => {
    const services = await getTicketServices(ticketId);
    setTicketServices(services || []);
  };

  const handleTicketStatusChange = async (ticketId: string, status: string) => {
    if (status === 'pending' || status === 'processing') {
      const success = await markTicketAsReady(ticketId);
      if (success) {
        refreshTickets();
        toast.success('Ticket marcado como listo para retirar');
      }
    }
  };

  const handleTicketDelivered = async (ticketId: string) => {
    const success = await markTicketAsDelivered(ticketId);
    if (success) {
      refreshTickets();
      toast.success('Ticket marcado como entregado');
    }
  };

  const refreshTickets = () => {
    refetchProcessing();
    refetchPending();
    refetchReady();
    queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
    setSelectedTicket(null);
  };

  // Filter tickets based on search query
  const filteredTickets = processingTickets.filter(ticket => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    if (searchFilter === 'name') {
      return ticket.clientName?.toLowerCase().includes(searchLower) || false;
    } else {
      return ticket.phoneNumber?.includes(searchQuery) || false;
    }
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  return {
    tickets: processingTickets,
    filteredTickets,
    pendingTickets,
    readyTickets,
    selectedTicket,
    setSelectedTicket,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    ticketServices,
    ticketDetailRef,
    isLoading,
    refetch: refreshTickets,
    loadTicketServices,
    handleTicketStatusChange,
    handleTicketDelivered,
    refreshTickets,
    formatDate
  };
};
