
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDeliveredTickets, getTicketServices } from '@/lib/tickets';
import { toast } from 'sonner';
import { Ticket } from '@/lib/types';

export function useDeliveredTickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  
  // Fetch delivered tickets
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['deliveredTickets'],
    queryFn: getDeliveredTickets
  });

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast.error('Error al cargar tickets', { 
        description: 'No se pudieron cargar los tickets entregados.' 
      });
    }
  }, [error]);

  // Load services when ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    } else {
      setTicketServices([]);
    }
  }, [selectedTicket]);

  const loadTicketServices = async (ticketId: string) => {
    try {
      const services = await getTicketServices(ticketId);
      setTicketServices(services);
    } catch (err) {
      console.error("Error loading ticket services:", err);
      toast.error('Error al cargar servicios', {
        description: 'No se pudieron cargar los detalles del ticket.'
      });
    }
  };
  
  // Filter tickets based on search
  const filteredTickets = searchQuery.trim() 
    ? tickets.filter((ticket: Ticket) => 
        ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phoneNumber.includes(searchQuery)
      )
    : tickets;

  return {
    searchQuery,
    setSearchQuery,
    selectedTicket,
    setSelectedTicket,
    ticketServices,
    tickets: filteredTickets,
    isLoading,
    error
  };
}
