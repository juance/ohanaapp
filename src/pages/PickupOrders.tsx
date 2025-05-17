
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePickupOrdersLogic } from '@/hooks/usePickupOrdersLogic';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import OrderHeader from '@/components/orders/OrderHeader';
import SearchBar from '@/components/orders/SearchBar';
import PickupTicketList from '@/components/orders/PickupTicketList';
import TicketDetailPanel from '@/components/orders/TicketDetailPanel';
import PickupActionButtons from '@/components/orders/PickupActionButtons';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    handleShareWhatsApp,
    handleNotifyClient,
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod,
    formatDate
  } = usePickupOrdersLogic();

  // Load ticket services when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      loadTicketServices(selectedTicket);
    }
  }, [selectedTicket, loadTicketServices]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
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
            handleShareWhatsApp={handleShareWhatsApp}
            handleNotifyClient={handleNotifyClient}
            handleOpenPaymentMethodDialog={handleOpenPaymentMethodDialog}
          />
          
          <Tabs defaultValue="pending" className="mb-4">
            <TabsList>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="processing">En Proceso</TabsTrigger>
              <TabsTrigger value="ready">Listos</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          ) : isError ? (
            <ErrorMessage 
              message={error?.message || 'Error al cargar los tickets'} 
              onRetry={refetch} 
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-auto p-1">
                <PickupTicketList
                  tickets={filteredTickets || []}
                  selectedTicket={selectedTicket}
                  setSelectedTicket={setSelectedTicket}
                  formatDate={formatDate}
                />
              </div>
              
              <div className="lg:col-span-7">
                <div ref={ticketDetailRef} className="bg-gray-50 rounded-lg p-6 border">
                  <TicketDetailPanel
                    ticket={filteredTickets?.find(t => t.id === selectedTicket)}
                    services={ticketServices}
                    formatDate={formatDate}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cancel Dialog */}
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancelar Ticket</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <Label htmlFor="cancelReason">Motivo de cancelación</Label>
                <Input
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ingrese el motivo de cancelación"
                  className="mt-2"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleCancelTicket}
                  disabled={!cancelReason}
                >
                  Confirmar Cancelación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment Method Dialog */}
          <Dialog open={paymentMethodDialogOpen} onOpenChange={setPaymentMethodDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Método de Pago</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <Label htmlFor="paymentMethod">Seleccionar método de pago</Label>
                <Select onValueChange={handleUpdatePaymentMethod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="debit">Débito</SelectItem>
                    <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                    <SelectItem value="cuenta_dni">Cuenta DNI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentMethodDialogOpen(false)}>
                  Cancelar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PickupOrders;
