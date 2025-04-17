import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPickupTickets, markTicketAsDelivered, markTicketAsPaid, updateTicketPaymentMethod } from '@/lib/ticket/ticketPickupService';
import { toast } from '@/lib/toast';
import { Ticket, PaymentMethod } from '@/lib/types';
import { format } from 'date-fns';

export const usePickupOrdersLogic = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'phone'>('name');
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);

  // Fetch pickup tickets
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: getPickupTickets,
    refetchInterval: 30000,
    staleTime: 15000, // Use staleTime instead of cacheTime
  });

  // Function to filter tickets based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const results = tickets.filter(ticket => {
        if (searchBy === 'name' && ticket.clientName) {
          return ticket.clientName.toLowerCase().includes(term);
        } else if (searchBy === 'phone' && ticket.phoneNumber) {
          return ticket.phoneNumber.toLowerCase().includes(term);
        }
        return false;
      });
      setFilteredTickets(results);
    } else {
      setFilteredTickets(tickets);
    }
  }, [searchTerm, searchBy, tickets]);

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error("Error formatting date", error);
      return 'Fecha inválida';
    }
  };

  // Function to handle marking a ticket as paid
  const handleMarkAsPaid = async (ticketId: string) => {
    try {
      const success = await markTicketAsPaid(ticketId);
      if (success) {
        toast.success('Ticket marcado como pagado');
        refetch(); // Refresh the ticket list
      } else {
        toast.error('Error al marcar como pagado');
      }
    } catch (error) {
      console.error("Error marking ticket as paid", error);
      toast.error('Error al marcar como pagado');
    }
  };

  // Function to handle marking a ticket as delivered
  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      const success = await markTicketAsDelivered(ticketId);
      if (success) {
        toast.success('Ticket marcado como entregado');
        refetch(); // Refresh the ticket list
      } else {
        toast.error('Error al marcar como entregado');
      }
    } catch (error) {
      console.error("Error marking ticket as delivered", error);
      toast.error('Error al marcar como entregado');
    }
  };

  // Function to handle payment method update
  const handleUpdatePaymentMethod = async (ticketId: string, paymentMethod: PaymentMethod) => {
    try {
      const success = await updateTicketPaymentMethod(ticketId, paymentMethod);
      if (success) {
        toast.success('Método de pago actualizado');
        refetch(); // Refresh the ticket list
      } else {
        toast.error('Error al actualizar el método de pago');
      }
    } catch (error) {
      console.error("Error updating payment method", error);
      toast.error('Error al actualizar el método de pago');
    }
  };

  return {
    tickets,
    isLoading,
    error,
    selectedTicket,
    setSelectedTicket,
    openPaymentDialog,
    setOpenPaymentDialog,
    searchTerm,
    setSearchTerm,
    searchBy,
    setSearchBy,
    filteredTickets,
    formatDate,
    handleMarkAsPaid,
    handleMarkAsDelivered,
    handleUpdatePaymentMethod,
    refetch
  };
};
