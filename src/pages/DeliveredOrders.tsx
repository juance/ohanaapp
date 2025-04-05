
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Check } from 'lucide-react';
import { getDeliveredTickets, getTicketServices } from '@/lib/ticketService';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DeliveredOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  
  // Fetch delivered tickets
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ['deliveredTickets'],
    queryFn: getDeliveredTickets
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
  
  const filteredTickets = searchQuery.trim() 
    ? tickets.filter(ticket => 
        ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.phoneNumber.includes(searchQuery)
      )
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
          <p>Cargando tickets entregados...</p>
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
            <h2 className="text-xl font-bold mb-4">Pedidos Entregados</h2>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o teléfono"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-4">
                {filteredTickets.map(ticket => (
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
                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                          <Check className="h-3 w-3" />
                          <span>Entregado</span>
                        </div>
                      </div>
                      <div className="text-sm mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Fecha de creación:</span>
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fecha de entrega:</span>
                          <span>{formatDate(ticket.deliveredDate || '')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-medium text-blue-700">$ {ticket.totalPrice.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredTickets.length === 0 && (
                  <div className="col-span-full text-center p-8 text-gray-500">
                    No se encontraron tickets entregados
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50">
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
                              <p className="text-sm text-gray-500">Cliente:</p>
                              <p className="font-medium">{ticket.clientName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Teléfono:</p>
                              <p className="font-medium">{ticket.phoneNumber}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Fecha de creación:</p>
                              <p className="font-medium">{formatDate(ticket.createdAt)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Fecha de entrega:</p>
                              <p className="font-medium">{formatDate(ticket.deliveredDate || '')}</p>
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
                                    <span>$ {(service.price * service.quantity).toLocaleString()}</span>
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
    </div>
  );
};

export default DeliveredOrders;
