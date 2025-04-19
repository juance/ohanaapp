
import { useState, useRef } from 'react';
import { Ticket, DryCleaningItem, LaundryOption } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketServices } from '@/lib/ticketService';
import { getProcessingTickets } from '@/lib/ticket/ticketPendingService';
import { markTicketAsReady } from '@/lib/ticket/ticketStatusTransitionService';
import { toast } from '@/lib/toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const usePendingOrdersLogic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['processingTickets'],
    queryFn: () => getProcessingTickets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  const loadTicketServices = async (ticketId: string) => {
    const services = await getTicketServices(ticketId);
    // Fixed: Using SetStateAction properly for array updates
    setTicketServices(services);
  };

  const handleMarkAsReady = async (ticketId: string) => {
    const success = await markTicketAsReady(ticketId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['pendingTickets'] });
      queryClient.invalidateQueries({ queryKey: ['processingTickets'] });
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      setSelectedTicket(null);
      refetch();
      toast.success('Ticket marcado como listo para retirar');
    }
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket => {
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
    tickets,
    filteredTickets,
    selectedTicket,
    setSelectedTicket,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    ticketServices,
    ticketDetailRef,
    isLoading,
    error,
    refetch,
    loadTicketServices,
    handleMarkAsReady,
    formatDate
  };
};
