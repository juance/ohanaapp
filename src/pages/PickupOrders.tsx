
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { Ticket } from '@/lib/types';
import { getReadyTickets, markTicketAsDelivered } from '@/lib/ticketService';
import OrderHeader from '@/components/orders/OrderHeader';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import SearchBar from '@/components/orders/SearchBar';

// Create a simple TicketCard component to replace the missing import
const TicketCard: React.FC<{
  ticket: Ticket;
  onClick: () => void;
  onDeliver: () => void;
}> = ({ ticket, onClick, onDeliver }) => {
  return (
    <Card className="cursor-pointer hover:border-blue-300" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">#{ticket.ticketNumber}</h3>
            <p className="text-sm">{ticket.clientName}</p>
            <p className="text-xs text-gray-500">{ticket.phoneNumber}</p>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDeliver();
            }}
          >
            Entregar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const PickupOrders: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'valet' | 'drycleaning'>('all');

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
      (ticket.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.phoneNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch; // We can't filter by type since this field isn't in our Ticket type
  });

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <OrderHeader 
            title="Tickets para Entrega" 
          />
          
          <div className="mb-4">
            <SearchBar 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter === 'all' ? 'name' : 'phone'} 
              setSearchFilter={(filter) => setSearchFilter(filter === 'name' ? 'all' : 'valet' as any)}
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
          ) : filteredTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => {}}
                  onDeliver={() => handleDeliverTicket(ticket.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay tickets listos para entregar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupOrders;
