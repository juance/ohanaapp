
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getDeliveredTickets, getTicketServices } from '@/lib/ticketService';
import { useQuery } from '@tanstack/react-query';
import OrderHeader from '@/components/orders/OrderHeader';
import SearchBar from '@/components/orders/SearchBar';
import DeliveredTicketList from '@/components/orders/DeliveredTicketList';
import TicketDetailPanel from '@/components/orders/TicketDetailPanel';

const DeliveredOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);

  // Fetch delivered tickets
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deliveredTickets'],
    queryFn: () => getDeliveredTickets(),
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
    staleTime: 0 // Consider data stale immediately
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
          <OrderHeader title="Pedidos Entregados" />

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Pedidos Entregados</h2>

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-4">
                <DeliveredTicketList
                  tickets={filteredTickets}
                  selectedTicket={selectedTicket}
                  setSelectedTicket={setSelectedTicket}
                  formatDate={formatDate}
                />
              </div>

              <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50">
                <TicketDetailPanel
                  selectedTicket={selectedTicket}
                  tickets={tickets}
                  ticketServices={ticketServices}
                  formatDate={formatDate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveredOrders;
