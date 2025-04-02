
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Bell, CheckCircle, Printer, Share2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Ticket } from '@/lib/types';
import { 
  getPickupTickets, 
  getTicketServices, 
  markTicketAsDelivered, 
  cancelTicket 
} from '@/lib/ticket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

const PickupOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();
  const ticketDetailRef = useRef<HTMLDivElement>(null);
  
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: getPickupTickets,
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

  const handleNotifyClient = (ticket: Ticket) => {
    if (ticket) {
      const whatsappMessage = encodeURIComponent(
        `Hola ${ticket.clientName}, su pedido está listo para retirar en Lavandería Ohana.`
      );
      const whatsappUrl = `https://wa.me/${ticket.phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast.success(`Notificación enviada a ${ticket.clientName}`, {
        description: `Se notificó que su pedido está listo para retirar.`
      });
    } else {
      toast.error('Seleccione un ticket primero');
    }
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    const success = await markTicketAsDelivered(ticketId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      queryClient.invalidateQueries({ queryKey: ['deliveredTickets'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      setSelectedTicket(null);
      refetch();
      toast.success('Ticket marcado como entregado y pagado exitosamente');
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

    const success = await cancelTicket(selectedTicket, cancelReason);
    if (success) {
      setCancelDialogOpen(false);
      setSelectedTicket(null);
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      refetch();
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
          return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        } else { // 'phone'
          return ticket.phoneNumber.includes(searchQuery);
        }
      })
    : tickets;
    
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <Navbar />
        <div className="flex-1 md:ml-64 p-6 flex items-center justify-center">
          <p>Cargando tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <Navbar />
        <div className="flex-1 md:ml-64 p-6 flex items-center justify-center">
          <p className="text-red-500">Error al cargar los tickets. Por favor, intente de nuevo.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
              <p className="text-gray-500">Sistema de Tickets</p>
            </div>
          </header>
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
            
            <div className="flex flex-wrap justify-end mb-4 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => {
                  const ticket = tickets.find(t => t.id === selectedTicket);
                  if (ticket) handleNotifyClient(ticket);
                  else toast.error('Seleccione un ticket primero');
                }}
                disabled={!selectedTicket}
              >
                <Bell className="h-4 w-4" />
                <span>Avisar al cliente</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handlePrintTicket}
                disabled={!selectedTicket}
              >
                <Printer className="h-4 w-4" />
                <span>IMPRIMIR</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleShareWhatsApp}
                disabled={!selectedTicket}
              >
                <Share2 className="h-4 w-4" />
                <span>ENVIAR POR WHATSAPP</span>
              </Button>
              
              <Button 
                variant="destructive" 
                className="flex items-center space-x-2"
                onClick={handleOpenCancelDialog}
                disabled={!selectedTicket}
              >
                <XCircle className="h-4 w-4" />
                <span>ANULAR</span>
              </Button>
              
              <Button 
                variant="default" 
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (selectedTicket) handleMarkAsDelivered(selectedTicket);
                  else toast.error('Seleccione un ticket primero');
                }}
                disabled={!selectedTicket}
              >
                <CheckCircle className="h-4 w-4" />
                <span>ENTREGADO</span>
              </Button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <Button 
                variant={searchFilter === 'name' ? "secondary" : "outline"} 
                className={searchFilter === 'name' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                onClick={() => setSearchFilter('name')}
              >
                Nombre
              </Button>
              <Button 
                variant={searchFilter === 'phone' ? "secondary" : "outline"} 
                className={searchFilter === 'phone' ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                onClick={() => setSearchFilter('phone')}
              >
                Teléfono
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={`Buscar por ${searchFilter === 'name' ? 'nombre del cliente' : 'teléfono'}`}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-4 border rounded-lg p-4 bg-gray-50 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <Card 
                      key={ticket.id}
                      className={`
                        cursor-pointer transition-all
                        ${selectedTicket === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : 'hover:border-blue-200'}
                      `}
                      onClick={() => setSelectedTicket(ticket.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{ticket.clientName}</div>
                            <div className="text-sm text-gray-500">{ticket.phoneNumber}</div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
                              {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
                            </Badge>
                            <div className="flex items-center gap-1 text-yellow-600 text-sm font-medium bg-yellow-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3" />
                              <span>Por retirar</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Fecha: {formatDate(ticket.createdAt)}</div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="font-medium text-blue-700">$ {ticket.totalPrice.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    {searchQuery ? 
                      'No se encontraron tickets que coincidan con su búsqueda' : 
                      'No hay tickets pendientes de entrega'}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50" ref={ticketDetailRef}>
                {selectedTicket ? (
                  <div className="w-full space-y-4">
                    <h3 className="text-lg font-medium">Detalles del Ticket</h3>
                    {(() => {
                      const ticket = tickets.find(t => t.id === selectedTicket);
                      if (!ticket) return <p>No se encontró el ticket seleccionado</p>;
                      
                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Ticket N°:</p>
                              <p className="font-medium">{ticket.ticketNumber || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Cliente:</p>
                              <p className="font-medium">{ticket.clientName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Teléfono:</p>
                              <p className="font-medium">{ticket.phoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Fecha:</p>
                              <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-3">
                            <p className="font-medium mb-2">Servicios:</p>
                            <div className="space-y-2">
                              {ticketServices.length > 0 ? (
                                ticketServices.map((service, index) => (
                                  <div key={index} className="flex justify-between text-sm border-b pb-1">
                                    <span>
                                      {service.name} x{service.quantity}
                                    </span>
                                    <span>$ {(service.price).toLocaleString()}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">Cargando servicios...</p>
                              )}
                            </div>
                            <div className="flex justify-between font-medium mt-3 text-blue-700">
                              <span>Total:</span>
                              <span>$ {ticket.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Seleccione un ticket para ver los detalles</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anular Ticket</DialogTitle>
            <DialogDescription>
              Ingrese el motivo por el cual se anula este ticket. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="Motivo de anulación" 
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelTicket}
              disabled={!cancelReason.trim()}
            >
              Anular Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PickupOrders;
