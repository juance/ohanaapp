
import { useState } from 'react';
import { Ticket } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketServices } from '@/lib/ticketService';
import { getPendingTickets, getReadyTickets } from '@/lib/ticket/ticketPendingService';
import { markTicketAsReady, markTicketAsDelivered } from '@/lib/ticket/ticketStatusTransitionService';
import { toast } from '@/lib/toast';

export const usePendingOrdersLogic = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  // Query for pending tickets
  const { 
    data: pendingTickets = [],
    isLoading: isLoadingPending,
    refetch: refetchPendingTickets
  } = useQuery({
    queryKey: ['pendingTickets'],
    queryFn: getPendingTickets
  });

  // Query for ready tickets
  const { 
    data: readyTickets = [],
    isLoading: isLoadingReady,
    refetch: refetchReadyTickets
  } = useQuery({
    queryKey: ['readyTickets'],
    queryFn: getReadyTickets
  });

  const refetchAllTickets = () => {
    refetchPendingTickets();
    refetchReadyTickets();
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedTicket(null);
  };

  const handleTicketStatusChange = async (ticketId: string, newStatus: string) => {
    if (isStatusChanging) return;
    
    setIsStatusChanging(true);
    try {
      if (newStatus === 'ready') {
        await markTicketAsReady(ticketId);
      } else if (newStatus === 'delivered') {
        await markTicketAsDelivered(ticketId);
      }
      toast.success(`Ticket marcado como ${newStatus}`);
      refetchAllTickets();
    } catch (error) {
      toast.error(`Error al cambiar el estado del ticket a ${newStatus}`);
      console.error(`Error marking ticket as ${newStatus}:`, error);
    } finally {
      setIsStatusChanging(false);
    }
  };

  const handleMarkAsReady = async (ticketId: string) => {
    return handleTicketStatusChange(ticketId, 'ready');
  };

  const handleTicketDelivered = async (ticketId: string) => {
    return handleTicketStatusChange(ticketId, 'delivered');
  };

  const handleEditTicket = (ticketId: string) => {
    navigate(`/tickets/edit/${ticketId}`);
  };

  const isLoading = isLoadingPending || isLoadingReady;
  
  const refreshTickets = refetchAllTickets;

  return {
    pendingTickets,
    readyTickets,
    isLoading,
    showDetails,
    selectedTicket,
    isStatusChanging,
    handleViewDetails,
    handleCloseDetails,
    handleTicketStatusChange,
    handleMarkAsReady,
    handleTicketDelivered,
    handleEditTicket,
    refetchAllTickets,
    refreshTickets
  };
};
