
import React, { useEffect } from 'react';
import { usePickupOrdersLogic } from '@/hooks/pickup';
import OrderHeader from '@/components/orders/OrderHeader';
import SearchBar from '@/components/orders/SearchBar';
import PickupActionButtons from '@/components/orders/PickupActionButtons';
import PickupTabsContent from '@/components/orders/PickupTabsContent';
import CancelTicketDialog from '@/components/orders/CancelTicketDialog';
import PaymentMethodDialog from '@/components/orders/PaymentMethodDialog';

const PickupOrders: React.FC = () => {
  const {
    // Data
    filteredTickets,
    ticketServices,

    // States
    selectedTicket,
    searchQuery,
    searchFilter,
    cancelDialogOpen,
    cancelReason,
    paymentMethodDialogOpen,
    isLoadingServices,

    // References
    ticketDetailRef,

    // Query state
    isLoading,
    isError,
    error,

    // Setters
    setSelectedTicket,
    setSearchQuery,
    setSearchFilter,
    setCancelDialogOpen,
    setCancelReason,
    setPaymentMethodDialogOpen,

    // Functions
    refetch,
    loadTicketServices,
    handleMarkAsDelivered,
    handleOpenCancelDialog,
    handleCancelTicket,
    handlePrintTicket,
    handleNotifyClient,
    handleShareWhatsApp,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    handleUpdateTicketPrice,
    formatDate
  } = usePickupOrdersLogic();

  // Load ticket services when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    }
  }, [selectedTicket, loadTicketServices]);

  return (
    <div className="space-y-6">
      <OrderHeader 
        title="Tickets para Entrega" 
        description="Visualiza y gestiona los tickets pendientes de entrega"
      />
      
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter} 
          setSearchFilter={setSearchFilter}
        />
      </div>

      <PickupActionButtons 
        tickets={filteredTickets || []}
        selectedTicket={selectedTicket}
        handleMarkAsDelivered={handleMarkAsDelivered}
        handleOpenCancelDialog={handleOpenCancelDialog}
        handlePrintTicket={handlePrintTicket}
        handleNotifyClient={handleNotifyClient}
        handleShareWhatsApp={handleShareWhatsApp}
        handleOpenPaymentMethodDialog={handleOpenPaymentMethodDialog}
      />
      
      <PickupTabsContent 
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        filteredTickets={filteredTickets}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        formatDate={formatDate}
        ticketServices={ticketServices}
        ticketDetailRef={ticketDetailRef}
        isLoadingServices={isLoadingServices}
        onPriceUpdate={handleUpdateTicketPrice}
      />

      {/* Dialogs */}
      <CancelTicketDialog 
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        onCancel={handleCancelTicket}
      />

      <PaymentMethodDialog 
        open={paymentMethodDialogOpen}
        onOpenChange={setPaymentMethodDialogOpen}
        onUpdatePaymentMethod={handleUpdatePaymentMethod}
      />
    </div>
  );
};

export default PickupOrders;
