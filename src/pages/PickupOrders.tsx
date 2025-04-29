
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { getReadyTickets, markTicketAsDelivered } from '@/lib/ticketService';
import OrderHeader from '@/components/orders/OrderHeader';
import TicketCard from '@/components/orders/TicketCard';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import SearchBar from '@/components/orders/SearchBar';

const PickupOrders: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const readyTickets = await getReadyTickets();
      setTickets(readyTickets);
      setError(null);
    } catch (err) {
      console.error('Error fetching ready tickets:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar tickets'));
      toast.error('Error al cargar los tickets listos para entrega');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverTicket = async (ticketId: string) => {
    try {
      await markTicketAsDelivered(ticketId);
      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      toast.success('Ticket marcado como entregado');
    } catch (err) {
      console.error('Error marking ticket as delivered:', err);
      toast.error('Error al marcar el ticket como entregado');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      (ticket.clientName || ticket.customerName || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.phoneNumber || ticket.customerPhone || '')?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchFilter === 'all') return matchesSearch;
    if (searchFilter === 'valet') return matchesSearch && ticket.type === 'valet';
    if (searchFilter === 'drycleaning') return matchesSearch && ticket.type === 'tintoreria';
    
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <OrderHeader 
            title="Tickets para Entrega" 
            description="Tickets listos para ser entregados" 
          />
          
          <div className="mb-4">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={(filter) => setSearchFilter(filter as string)}
            />
          </div>
          
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSearchFilter('all')}>Todos</TabsTrigger>
              <TabsTrigger value="valet" onClick={() => setSearchFilter('valet')}>Valet</TabsTrigger>
              <TabsTrigger value="drycleaning" onClick={() => setSearchFilter('drycleaning')}>Tintorería</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <ErrorMessage message={error.message} />
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="flex h-64 flex-col items-center justify-center p-6">
                <p className="mb-4 text-center text-gray-500">No hay tickets listos para entrega</p>
                <Button onClick={fetchTickets} variant="outline">
                  Actualizar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onAction={() => handleDeliverTicket(ticket.id)}
                  actionLabel="Marcar como Entregado"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupOrders;
