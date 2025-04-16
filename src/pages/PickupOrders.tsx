
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { usePickupOrdersLogic } from '@/hooks/usePickupOrdersLogic';
import OrderHeader from '@/components/orders/OrderHeader';
import SearchBar from '@/components/orders/SearchBar';
import PickupActionButtons from '@/components/orders/PickupActionButtons';
import PickupTicketList from '@/components/orders/PickupTicketList';
import TicketDetailPanel from '@/components/orders/TicketDetailPanel';
import CancelTicketDialog from '@/components/orders/CancelTicketDialog';
import DebugPanel from '@/components/debug/DebugPanel';

const PickupOrders = () => {
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
    handleNotifyClient,
    formatDate
  } = usePickupOrdersLogic();

  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    }
  }, [selectedTicket]);

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
          <div className="flex justify-between items-center mb-4">
            <OrderHeader title="Pedidos a Retirar" />
            <Button
              onClick={() => {
                console.log('Forzando recarga de tickets...');
                refetch();
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Recargar
            </Button>
          </div>

          <DebugPanel
            tickets={tickets}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
          />

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>

            <PickupActionButtons
              tickets={tickets}
              selectedTicket={selectedTicket}
              handleMarkAsDelivered={handleMarkAsDelivered}
              handleOpenCancelDialog={handleOpenCancelDialog}
              handlePrintTicket={handlePrintTicket}
              handleShareWhatsApp={handleShareWhatsApp}
              handleNotifyClient={handleNotifyClient}
            />

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

      <CancelTicketDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelTicket={handleCancelTicket}
      />
    </div>
  );
};

export default PickupOrders;
