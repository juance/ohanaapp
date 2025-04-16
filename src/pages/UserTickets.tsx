
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, Check, Clock, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import UserFeedbackForm from '@/components/user/UserFeedbackForm';
import { useQuery } from '@tanstack/react-query';
import {
  getTicketsByPhoneNumber,
  getDeliveredTicketsByPhoneNumber,
  getPendingTicketsByPhoneNumber
} from '@/lib/ticket/ticketUserService';
import { getTicketServices } from '@/lib/ticket/ticketServiceCore';
import { Ticket } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const UserTickets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const phoneParam = searchParams.get('phone') || '';
  const { user } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState(phoneParam || (user?.phoneNumber || ''));
  const [searchInput, setSearchInput] = useState(phoneParam || (user?.phoneNumber || ''));
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);

  // Initialize phone number from user if available
  useEffect(() => {
    if (user?.phoneNumber && !phoneNumber) {
      setPhoneNumber(user.phoneNumber);
      setSearchInput(user.phoneNumber);
      setSearchParams({ phone: user.phoneNumber });
    }
  }, [user, phoneNumber, setSearchParams]);

  // Load services when a ticket is selected
  useEffect(() => {
    if (selectedTicketId) {
      const loadServices = async () => {
        const services = await getTicketServices(selectedTicketId);
        setTicketServices(services);
      };
      loadServices();
    }
  }, [selectedTicketId]);

  // Fetch delivered tickets
  const deliveredTicketsQuery = useQuery({
    queryKey: ['userDeliveredTickets', phoneNumber],
    queryFn: () => getDeliveredTicketsByPhoneNumber(phoneNumber),
    enabled: !!phoneNumber
  });

  // Fetch pending tickets
  const pendingTicketsQuery = useQuery({
    queryKey: ['userPendingTickets', phoneNumber],
    queryFn: () => getPendingTicketsByPhoneNumber(phoneNumber),
    enabled: !!phoneNumber
  });

  const handleSearch = () => {
    if (searchInput.trim()) {
      setPhoneNumber(searchInput.trim());
      setSearchParams({ phone: searchInput.trim() });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="ml-2 bg-green-500 hover:bg-green-600">Entregado</Badge>;
      case 'ready':
        return <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">Listo para retirar</Badge>;
      case 'processing':
        return <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">En proceso</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Pendiente</Badge>;
    }
  };

  const renderTicket = (ticket: Ticket) => (
    <Card
      key={ticket.id}
      className={`mb-4 cursor-pointer hover:border-blue-200 transition-all ${
        selectedTicketId === ticket.id ? 'border-blue-500 ring-1 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedTicketId(ticket.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">Ticket #{ticket.ticketNumber}</div>
            <div className="text-sm text-gray-500">Fecha: {formatDate(ticket.createdAt)}</div>
          </div>
          <div className="flex flex-col items-end">
            {getStatusBadge(ticket.status)}
            <span className="font-medium text-blue-700 mt-2">${ticket.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Conditionally hide search bar for clients
  const showSearchBar = !user || user.role !== 'client';

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      <Navbar />

      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Mis Tickets</h1>
          <p className="text-gray-600 mb-6">Consulta el estado de tus tickets</p>

          {showSearchBar && (
            <div className="mb-6 flex gap-2">
              <Input
                type="tel"
                placeholder="Ingresa tu número de teléfono"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="max-w-sm"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          )}

          {phoneNumber ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Tabs defaultValue="pending">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="pending" className="flex-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Por Retirar</span>
                      {pendingTicketsQuery.data && <Badge variant="secondary" className="ml-2">{pendingTicketsQuery.data.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="delivered" className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      <span>Entregados</span>
                      {deliveredTicketsQuery.data && <Badge variant="secondary" className="ml-2">{deliveredTicketsQuery.data.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>Comentarios</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4">
                    {pendingTicketsQuery.isLoading ? (
                      <div className="text-center py-8">Cargando tickets pendientes...</div>
                    ) : pendingTicketsQuery.data?.length ? (
                      pendingTicketsQuery.data.map(renderTicket)
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No tienes tickets pendientes de retirar</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="delivered" className="space-y-4">
                    {deliveredTicketsQuery.isLoading ? (
                      <div className="text-center py-8">Cargando tickets entregados...</div>
                    ) : deliveredTicketsQuery.data?.length ? (
                      deliveredTicketsQuery.data.map(renderTicket)
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No tienes tickets entregados</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="feedback" className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-medium mb-4">Envíanos tus comentarios</h3>
                      <p className="text-gray-500 mb-4">
                        Nos encantaría conocer tu opinión sobre nuestro servicio. Tus comentarios nos ayudan a mejorar.
                      </p>
                      <UserFeedbackForm
                        customerName={user?.name || 'Cliente'}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Detalle del Ticket</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTicketId ? (
                      <>
                        {pendingTicketsQuery.data && deliveredTicketsQuery.data && (() => {
                          const allTickets = [...pendingTicketsQuery.data, ...deliveredTicketsQuery.data];
                          const selectedTicket = allTickets.find(t => t.id === selectedTicketId);

                          if (!selectedTicket) return <p>Ticket no encontrado</p>;

                          return (
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-500">Ticket Número:</p>
                                <p className="font-medium">{selectedTicket.ticketNumber}</p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Estado:</p>
                                <div>{getStatusBadge(selectedTicket.status)}</div>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500">Fecha de Creación:</p>
                                <p className="font-medium">{formatDate(selectedTicket.createdAt)}</p>
                              </div>

                              {selectedTicket.deliveredDate && (
                                <div>
                                  <p className="text-sm text-gray-500">Fecha de Entrega:</p>
                                  <p className="font-medium">{formatDate(selectedTicket.deliveredDate)}</p>
                                </div>
                              )}

                              <div>
                                <p className="text-sm text-gray-500 mb-2">Servicios:</p>
                                {ticketServices.length > 0 ? (
                                  <div className="space-y-2">
                                    {ticketServices.map((service, index) => (
                                      <div key={index} className="flex justify-between text-sm">
                                        <span>{service.name} x{service.quantity}</span>
                                        <span>${(service.price * service.quantity).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm">Cargando servicios...</p>
                                )}
                              </div>

                              <div className="pt-4 border-t">
                                <div className="flex justify-between font-medium">
                                  <span>Total:</span>
                                  <span className="text-blue-700">${selectedTicket.totalPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Selecciona un ticket para ver los detalles</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-blue-300" />
              <h2 className="text-xl font-medium mb-2">Consulta tus tickets</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Ingresa tu número de teléfono para ver el estado de tus tickets pendientes y entregados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTickets;
