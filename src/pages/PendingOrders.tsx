
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import OrderHeader from '@/components/orders/OrderHeader';
import SearchBar from '@/components/orders/SearchBar';
import PickupTicketList from '@/components/orders/PickupTicketList';
import TicketDetailPanel from '@/components/orders/TicketDetailPanel';
import { usePendingOrdersLogic } from '@/hooks/usePendingOrdersLogic';
import { useState } from 'react';

const PendingOrders = () => {
  const {
    tickets,
    filteredTickets,
    selectedTicket,
    setSelectedTicket,
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    ticketServices,
    ticketDetailRef,
    isLoading,
    error,
    refetch,
    loadTicketServices,
    handleMarkAsReady,
    formatDate
  } = usePendingOrdersLogic();

  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    }
  }, [selectedTicket, loadTicketServices]);

  // Find the selected ticket data
  const selectedTicketData = selectedTicket 
    ? tickets.find(ticket => ticket.id === selectedTicket) 
    : undefined;

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
          <OrderHeader title="Pedidos en Proceso" />

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Pedidos en Proceso</h2>

            <div className="flex space-x-2 mb-4">
              {selectedTicket && (
                <Button 
                  onClick={() => handleMarkAsReady(selectedTicket)}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Marcar como Listo para Retirar
                </Button>
              )}
            </div>

            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              placeholder={`Buscar por ${searchFilter === 'name' ? 'nombre del cliente' : 'teléfono'}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 space-y-4 border rounded-lg p-4 bg-gray-50 max-h-[calc(100vh-300px)] overflow-y-auto">
                <PickupTicketList 
                  tickets={filteredTickets}
                  selectedTicket={selectedTicket}
                  setSelectedTicket={setSelectedTicket}
                  formatDate={formatDate}
                />
              </div>

              <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50" ref={ticketDetailRef}>
                <TicketDetailPanel 
                  ticket={tickets.find(t => t.id === selectedTicket)}
                  services={ticketServices}
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

export default PendingOrders;
