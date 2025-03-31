
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

import { useDeliveredTickets } from '@/hooks/useDeliveredTickets';
import { SearchBar } from '@/components/delivered-orders/SearchBar';
import { TicketList } from '@/components/delivered-orders/TicketList';
import { TicketDetail } from '@/components/delivered-orders/TicketDetail';

const DeliveredOrders = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedTicket,
    setSelectedTicket,
    ticketServices,
    tickets,
    isLoading
  } = useDeliveredTickets();

  const selectedTicketData = selectedTicket 
    ? tickets.find(t => t.id === selectedTicket)
    : null;

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
            
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <TicketList 
                  tickets={tickets} 
                  selectedTicket={selectedTicket} 
                  onSelectTicket={setSelectedTicket} 
                />
              </div>
              
              <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50">
                <TicketDetail 
                  ticket={selectedTicketData}
                  services={ticketServices}
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
