
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getPickupTickets, markTicketAsDelivered, cancelTicket } from '@/lib/ticketServices';
import { Ticket } from '@/lib/types';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Check, Printer, Share2, X, Bell, CreditCard } from 'lucide-react';
import CancelTicketDialog from '@/components/orders/CancelTicketDialog';
import PaymentMethodDialog from '@/components/orders/PaymentMethodDialog';
import PickupActionButtons from '@/components/orders/PickupActionButtons';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchBar } from '@/components/ui/search-bar';
import { buildTicketWhatsAppMessage } from '@/lib/utils/whatsappUtils';
import { useSearchParams } from 'react-router-dom';

const PendingOrders = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');

  useEffect(() => {
    // Update search params when searchQuery changes
    setSearchParams({ search: searchQuery });
  }, [searchQuery, setSearchParams]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const fetchedTickets = await getPickupTickets();
        setTickets(fetchedTickets);
        setError(null);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      await markTicketAsDelivered(ticketId);
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      setSelectedTicket(null);
      toast.success('Ticket marcado como entregado');
    } catch (err) {
      console.error("Error marking ticket as delivered:", err);
      toast.error('Error al marcar el ticket como entregado');
    }
  };

  const handleOpenCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
    setCancelReason('');
  };

  const handleCancelTicket = async () => {
    if (!selectedTicket) return;

    try {
      await cancelTicket(selectedTicket, cancelReason);
      setTickets(tickets.filter(ticket => ticket.id !== selectedTicket));
      setSelectedTicket(null);
      handleCloseCancelDialog();
      toast.success('Ticket cancelado exitosamente');
    } catch (err) {
      console.error("Error canceling ticket:", err);
      toast.error('Error al cancelar el ticket');
    }
  };

  const handlePrintTicket = (ticketId: string) => {
    window.open(`/print/${ticketId}`, '_blank');
  };

  const handleShareWhatsApp = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('No se puede compartir por WhatsApp: número de teléfono no encontrado');
      return;
    }

    const ticket = tickets.find(ticket => ticket.id === ticketId);
    if (!ticket) {
      toast.error('No se puede compartir por WhatsApp: ticket no encontrado');
      return;
    }

    const message = buildTicketWhatsAppMessage(ticket);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNotifyClient = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('No se puede notificar al cliente: número de teléfono no encontrado');
      return;
    }

    const message = `Tu pedido #${ticketId} está listo para ser retirado. ¡Te esperamos!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOpenPaymentMethodDialog = () => {
    setIsPaymentMethodDialogOpen(true);
  };

  const handleClosePaymentMethodDialog = () => {
    setIsPaymentMethodDialogOpen(false);
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchTerm = searchQuery.toLowerCase();
    if (searchFilter === 'name') {
      return ticket.clientName.toLowerCase().includes(searchTerm);
    } else if (searchFilter === 'phone') {
      return ticket.phoneNumber.includes(searchTerm);
    }
    return false;
  });

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">Tickets Pendientes de Retiro</h1>
        <p className="text-gray-500">Lista de tickets listos para ser retirados por el cliente</p>
      </header>

      <PickupActionButtons
        tickets={tickets}
        selectedTicket={selectedTicket}
        handleMarkAsDelivered={handleMarkAsDelivered}
        handleOpenCancelDialog={handleOpenCancelDialog}
        handlePrintTicket={handlePrintTicket}
        handleShareWhatsApp={handleShareWhatsApp}
        handleNotifyClient={handleNotifyClient}
        handleOpenPaymentMethodDialog={handleOpenPaymentMethodDialog}
      />

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />

      {isLoading && <Loading />}

      {error && (
        <ErrorMessage
          message={error.message}
          title="Error al cargar los tickets"
          onRetry={() => window.location.reload()}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map(ticket => (
          <div
            key={ticket.id}
            className={`rounded-lg border p-4 cursor-pointer ${selectedTicket === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            onClick={() => handleTicketSelect(ticket.id)}
          >
            <h3 className="font-semibold">{ticket.clientName}</h3>
            <p className="text-sm text-gray-500">{ticket.phoneNumber}</p>
            <p className="text-sm">Ticket #: {ticket.ticketNumber}</p>
            <p className="text-sm">Total: ${ticket.totalPrice}</p>
          </div>
        ))}
      </div>

      <CancelTicketDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelTicket={handleCancelTicket}
      />

      <PaymentMethodDialog
        open={isPaymentMethodDialogOpen}
        onOpenChange={handleClosePaymentMethodDialog}
        currentPaymentMethod="cash"
        onConfirm={() => {}}
        ticketNumber={selectedTicket ? tickets.find(t => t.id === selectedTicket)?.ticketNumber || '' : ''}
      />
    </Layout>
  );
};

export default PendingOrders;
