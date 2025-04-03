
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CancelTicketDialog from '@/components/pickup/CancelTicketDialog';
import PickupContainer from '@/components/pickup/PickupContainer';
import PickupLoadingState from '@/components/pickup/PickupLoadingState';
import PickupErrorState from '@/components/pickup/PickupErrorState';
import { getPickupTickets } from '@/lib/ticket';
import { useTicketOperations } from '@/hooks/useTicketOperations';
import { handleShareWhatsApp, handleNotifyClient } from '@/components/pickup/ticketActionUtils';

const PickupOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  
  const {
    tickets,
    isLoading,
    error,
    refetch,
    selectedTicket,
    setSelectedTicket,
    ticketServices,
    isLoadingServices,
    serviceError,
    cancelDialogOpen,
    setCancelDialogOpen,
    cancelReason,
    setCancelReason,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleMarkAsDelivered,
    filterTickets,
  } = useTicketOperations({
    queryKey: ['pickupTickets'],
    fetchFunction: getPickupTickets
  });

  if (isLoading && tickets.length === 0) {
    return <PickupLoadingState />;
  }

  if (error && !isLoading && tickets.length === 0) {
    return <PickupErrorState onRetry={refetch} />;
  }
  
  const filteredTickets = filterTickets(searchQuery, searchFilter);
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <PickupContainer
          tickets={filteredTickets}
          onOpenCancelDialog={handleOpenCancelDialog}
          onPrintTicket={handlePrintTicket}
          onShareWhatsApp={() => {
            const ticket = tickets.find(t => t.id === selectedTicket);
            if (ticket) {
              handleShareWhatsApp(ticket, ticketServices);
            }
          }}
          onMarkAsDelivered={handleMarkAsDelivered}
          onNotifyClient={() => {
            const ticket = tickets.find(t => t.id === selectedTicket);
            if (ticket) {
              handleNotifyClient(ticket);
            }
          }}
          setCancelReason={setCancelReason}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          ticketServices={ticketServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          isLoading={isLoading}
          isLoadingServices={isLoadingServices}
          error={error}
          serviceError={serviceError}
        />
      </div>

      <CancelTicketDialog 
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onCancelTicket={handleCancelTicket}
      />
    </div>
  );
};

export default PickupOrders;
