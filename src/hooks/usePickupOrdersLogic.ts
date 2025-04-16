
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPickupTickets, cancelTicket, markTicketAsDelivered, updateTicketPaymentMethod } from '@/lib/ticket/ticketPickupService';
import { getTicketServices } from '@/lib/ticketService';
import { Ticket, PaymentMethod } from '@/lib/types';

export const usePickupOrdersLogic = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // Fetch tickets con configuración mejorada
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: getPickupTickets,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    staleTime: 0, // Consider data stale immediately
    retry: 3, // Reintentar 3 veces si hay error
    retryDelay: 1000, // Esperar 1 segundo entre reintentos
    cacheTime: 0, // No cachear los resultados
    onError: (err) => {
      console.error('Error en la consulta de tickets:', err);
      toast.error('Error al cargar los tickets');
    },
    onSuccess: (data) => {
      console.log('Tickets cargados correctamente:', data.length);
    }
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

    // Buscar el ticket seleccionado
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      toast.error('No se pudo encontrar el ticket para imprimir');
      return;
    }

    // Crear contenido HTML para imprimir
    const printContent = `
      <html>
        <head>
          <title>Ticket #${ticket.ticketNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .ticket { max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 15px; }
            .info div { margin-bottom: 5px; }
            .total { font-weight: bold; margin-top: 10px; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2>Lavandería Ohana</h2>
              <p>Ticket #${ticket.ticketNumber}</p>
            </div>
            <div class="info">
              <div><strong>Cliente:</strong> ${ticket.clientName || 'Cliente sin nombre'}</div>
              <div><strong>Teléfono:</strong> ${ticket.phoneNumber || 'Sin teléfono'}</div>
              <div><strong>Fecha:</strong> ${formatDate(ticket.createdAt)}</div>
              <div><strong>Estado:</strong> ${ticket.status === 'ready' ? 'Listo para retirar' : ticket.status}</div>
              <div><strong>Pagado:</strong> ${ticket.isPaid ? 'Sí' : 'No'}</div>
            </div>
            <div class="total">
              <div>Total: $${(ticket.totalPrice || 0).toLocaleString()}</div>
            </div>
            <div class="footer">
              <p>Gracias por confiar en Lavandería Ohana</p>
              <p>Camargo 590, Villa Crespo - Tel: 1136424871</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Abrir ventana de impresión
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Por favor, habilite las ventanas emergentes para imprimir');
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Imprimir después de que la ventana esté cargada
    printWindow.onload = function() {
      try {
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      } catch (error) {
        console.error('Error al imprimir:', error);
        toast.error('Error al imprimir el ticket');
        printWindow.close();
      }
    };

    // Si onload no se dispara (por ejemplo, en algunos navegadores)
    setTimeout(() => {
      try {
        printWindow.print();
        setTimeout(() => printWindow.close(), 500);
      } catch (error) {
        console.error('Error al imprimir (timeout):', error);
      }
    }, 500);
  };

  // Handle share WhatsApp
  const handleShareWhatsApp = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('El cliente no tiene número de teléfono registrado');
      return;
    }

    console.log('Compartir por WhatsApp:', ticketId, phoneNumber);

    // Buscar el ticket seleccionado
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      toast.error('No se pudo encontrar el ticket para compartir');
      return;
    }

    // Formatear el número de teléfono (eliminar caracteres no numéricos)
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    // Crear mensaje para WhatsApp
    const message = `Hola ${ticket.clientName || 'Cliente'}, tu pedido en Lavandería Ohana está listo para retirar.

Detalles del pedido:
- Ticket #: ${ticket.ticketNumber}
- Fecha: ${formatDate(ticket.createdAt)}
- Total: $${(ticket.totalPrice || 0).toLocaleString()}

Puedes pasar a retirarlo en nuestro horario de atención: Lunes a Sábado de 9:00 a 19:00 hs.

Gracias por confiar en Lavandería Ohana.
Camargo 590, Villa Crespo - Tel: 1136424871`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');

    toast.success('Mensaje de WhatsApp preparado');
  };

  // Handle notify client
  const handleNotifyClient = (ticketId: string, phoneNumber?: string) => {
    if (!phoneNumber) {
      toast.error('El cliente no tiene número de teléfono registrado');
      return;
    }

    console.log('Avisar al cliente:', ticketId, phoneNumber);

    // Buscar el ticket seleccionado
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      toast.error('No se pudo encontrar el ticket para notificar');
      return;
    }

    // Formatear el número de teléfono (eliminar caracteres no numéricos)
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    // Crear mensaje para WhatsApp
    const message = `Hola ${ticket.clientName || 'Cliente'}, te recordamos que tu pedido en Lavandería Ohana está listo para retirar desde el ${formatDate(ticket.createdAt)}.

Detalles del pedido:
- Ticket #: ${ticket.ticketNumber}
- Total: $${(ticket.totalPrice || 0).toLocaleString()}

Puedes pasar a retirarlo en nuestro horario de atención: Lunes a Sábado de 9:00 a 19:00 hs.

Gracias por confiar en Lavandería Ohana.
Camargo 590, Villa Crespo - Tel: 1136424871`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);

    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');

    toast.success(`Notificación enviada a ${ticket.clientName || 'Cliente'}`);
  };

  // Handle open payment method dialog
  const handleOpenPaymentMethodDialog = () => {
    if (!selectedTicket) {
      toast.error('Debe seleccionar un ticket primero');
      return;
    }
    setPaymentMethodDialogOpen(true);
  };

  // Handle update payment method
  const handleUpdatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    if (!selectedTicket) {
      toast.error('Debe seleccionar un ticket primero');
      return;
    }

    try {
      const ticket = tickets.find(t => t.id === selectedTicket);
      if (!ticket) {
        toast.error('No se pudo encontrar el ticket seleccionado');
        return;
      }

      await updateTicketPaymentMethod(selectedTicket, paymentMethod);
      toast.success(`Método de pago actualizado a ${getPaymentMethodName(paymentMethod)}`);

      // Invalidate pickup tickets query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });

      // Refetch pickup tickets
      refetch();
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Error al actualizar el método de pago');
    }
  };

  // Helper function to get payment method name
  const getPaymentMethodName = (method: PaymentMethod): string => {
    const methodNames: Record<PaymentMethod, string> = {
      cash: 'Efectivo',
      debit: 'Tarjeta de Débito',
      mercadopago: 'Mercado Pago',
      cuenta_dni: 'Cuenta DNI'
    };
    return methodNames[method] || method;
  };

  // Set selected ticket and load services
  useEffect(() => {
    if (selectedTicket) {
      console.log('Loading services for ticket:', selectedTicket);
      loadTicketServices(selectedTicket);

      // Scroll to ticket detail if on mobile
      if (window.innerWidth < 768 && ticketDetailRef.current) {
        setTimeout(() => {
          ticketDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      setTicketServices([]);
    }
  }, [selectedTicket]);

  // Reload services when tickets are refreshed
  useEffect(() => {
    if (selectedTicket && tickets.length > 0) {
      console.log('Reloading services after tickets refresh');
      loadTicketServices(selectedTicket);
    }
  }, [tickets]);

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
    paymentMethodDialogOpen,
    setPaymentMethodDialogOpen,
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
    handleNotifyClient,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    formatDate
  };
};
