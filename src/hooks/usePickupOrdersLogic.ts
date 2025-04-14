
import { useState, useRef, useEffect } from 'react';
import { Ticket } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTicketServices } from '@/lib/ticketService';
import { getPickupTickets, markTicketAsDelivered, cancelTicket } from '@/lib/ticket/ticketPickupService';
import { toast } from '@/lib/toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const usePickupOrdersLogic = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // Query for pickup tickets
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: async () => {
      console.log('Fetching pickup tickets');
      const result = await getPickupTickets();
      console.log('Pickup tickets result:', result.length, 'tickets');
      return result;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Fetch tickets when component mounts
  useEffect(() => {
    console.log('usePickupOrdersLogic mounted, fetching tickets');
    refetch();
  }, [refetch]);

  // Log tickets when they change
  useEffect(() => {
    console.log('Tickets in usePickupOrdersLogic:', tickets.length);
    if (tickets.length > 0) {
      console.log('Ticket sample:', tickets[0]);
      console.log('Ticket statuses:', tickets.map(t => t.status).join(', '));
    }
  }, [tickets]);

  const loadTicketServices = async (ticketId: string) => {
    try {
      console.log('Loading ticket services for:', ticketId);
      const services = await getTicketServices(ticketId);
      console.log('Ticket services loaded:', services.length);
      setTicketServices(services);
    } catch (error) {
      console.error('Error loading ticket services:', error);
      setTicketServices([]);
    }
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    try {
      console.log('Marking ticket as delivered:', ticketId);
      const success = await markTicketAsDelivered(ticketId);
      
      if (success) {
        console.log('Ticket marked as delivered successfully');
        queryClient.invalidateQueries({ queryKey: ['pendingTickets'] });
        queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
        queryClient.invalidateQueries({ queryKey: ['deliveredTickets'] });
        queryClient.invalidateQueries({ queryKey: ['metrics'] });
        setSelectedTicket(null);
        refetch();
        toast.success('Ticket marcado como entregado y pagado exitosamente');
      } else {
        toast.error('Error al marcar el ticket como entregado');
      }
    } catch (error) {
      console.error('Error in handleMarkAsDelivered:', error);
      toast.error('Error al marcar el ticket como entregado');
    }
  };

  const handleOpenCancelDialog = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  const handleCancelTicket = async () => {
    if (!selectedTicket) return;

    if (!cancelReason.trim()) {
      toast.error('Por favor ingrese un motivo para anular el ticket');
      return;
    }

    try {
      const success = await cancelTicket(selectedTicket, cancelReason);
      if (success) {
        setCancelDialogOpen(false);
        setSelectedTicket(null);
        queryClient.invalidateQueries({ queryKey: ['pendingTickets'] });
        queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
        refetch();
        toast.success('Ticket anulado exitosamente');
      } else {
        toast.error('Error al anular el ticket');
      }
    } catch (error) {
      console.error('Error canceling ticket:', error);
      toast.error('Error al anular el ticket');
    }
  };

  const handlePrintTicket = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('El navegador bloqueó la apertura de la ventana de impresión');
      return;
    }

    const formattedDate = formatDate(ticket.createdAt);

    const servicesContent = ticketServices.length > 0
      ? ticketServices.map(service =>
          `<div class="service-item">
            <span>${service.name} x${service.quantity}</span>
            <span>$ ${(service.price).toLocaleString()}</span>
          </div>`
        ).join('')
      : '<p>No hay servicios registrados</p>';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ticket</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .ticket-info {
            margin-bottom: 20px;
          }
          .ticket-info p {
            margin: 5px 0;
          }
          .services {
            margin-bottom: 20px;
          }
          .service-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .total {
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
            font-size: 1.2em;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Lavandería Ohana</h1>
          <p>Ticket de servicio</p>
        </div>

        <div class="ticket-info">
          <p><strong>Ticket N°:</strong> ${ticket.ticketNumber || 'N/A'}</p>
          <p><strong>Cliente:</strong> ${ticket.clientName}</p>
          <p><strong>Teléfono:</strong> ${ticket.phoneNumber}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
        </div>

        <h3>Servicios:</h3>
        <div class="services">
          ${servicesContent}
        </div>

        <div class="total">
          Total: $ ${ticket.totalPrice.toLocaleString()}
        </div>

        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Imprimir Ticket
          </button>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };

    toast.success('Preparando impresión del ticket');
  };

  const handleShareWhatsApp = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    let message = `🧼 *LAVANDERÍA OHANA - TICKET* 🧼\n\n`;
    message += `Estimado/a ${ticket.clientName},\n\n`;
    message += `Su pedido está listo para retirar.\n\n`;

    if (ticketServices.length > 0) {
      message += `*Detalle de servicios:*\n`;
      ticketServices.forEach(service => {
        message += `- ${service.name} x${service.quantity}: $${service.price.toLocaleString()}\n`;
      });
    }

    message += `\n*Total a pagar: $${ticket.totalPrice.toLocaleString()}*\n\n`;
    message += `Gracias por confiar en Lavandería Ohana.`;

    const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    toast.success(`Compartiendo ticket con ${ticket.clientName}`);
  };

  const filteredTickets = searchQuery.trim()
    ? tickets.filter(ticket => {
        if (searchFilter === 'name') {
          return ticket.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
        } else { // 'phone'
          return ticket.phoneNumber?.includes(searchQuery);
        }
      })
    : tickets;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      console.error('Error formatting date:', e);
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
    setTicketServices,
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
