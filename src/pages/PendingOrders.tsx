
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePendingOrdersLogic } from '@/hooks/usePendingOrdersLogic';
import { Badge } from '@/components/ui/badge';
import { Phone, ArrowLeft, ArrowRight, WheatIcon } from 'lucide-react';
import CancelTicketDialog from '@/components/orders/CancelTicketDialog';
import PaymentMethodDialog from '@/components/orders/PaymentMethodDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket } from '@/lib/types';
import SearchBar from '@/components/ui/search-bar';
import { openWhatsApp } from '@/lib/utils/whatsappUtils';
import OrderCard from '@/components/orders/OrderCard';

const PendingOrders = () => {
  const {
    pendingTickets,
    readyTickets,
    isLoading,
    handleMarkAsReady,
    handleTicketDelivered,
    refetchAllTickets
  } = usePendingOrdersLogic();
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketToCancelId, setTicketToCancelId] = useState<string | null>(null);
  const [ticketToChangePayment, setTicketToChangePayment] = useState<Ticket | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  
  // Filter tickets based on search query
  const filteredPendingTickets = pendingTickets?.filter(ticket => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    if (searchFilter === 'name') {
      return ticket.clientName.toLowerCase().includes(query);
    } else {
      return ticket.phoneNumber.toLowerCase().includes(query);
    }
  }) || [];
  
  const filteredReadyTickets = readyTickets?.filter(ticket => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    if (searchFilter === 'name') {
      return ticket.clientName.toLowerCase().includes(query);
    } else {
      return ticket.phoneNumber.toLowerCase().includes(query);
    }
  }) || [];
  
  const handleCancelTicket = (ticketId: string) => {
    setTicketToCancelId(ticketId);
  };
  
  const handleChangePaymentMethod = (ticket: Ticket) => {
    setTicketToChangePayment(ticket);
  };
  
  const handleSendWhatsAppReminder = (ticket: Ticket) => {
    const message = `Hola! Tu ropa ya está lista para retirar. Ticket #${ticket.ticketNumber}. Gracias por confiar en nosotros!`;
    openWhatsApp(ticket.phoneNumber, message);
  };

  const refreshTickets = refetchAllTickets;
  
  const handleTicketStatusChange = async (ticketId: string, newStatus: string) => {
    if (newStatus === 'ready') {
      await handleMarkAsReady(ticketId);
    } else if (newStatus === 'delivered') {
      await handleTicketDelivered(ticketId);
    }
  };

  const handleCancelConfirm = async () => {
    // Handle ticket cancellation logic here
    // After cancellation:
    setTicketToCancelId(null);
    setCancelReason('');
    refreshTickets();
  };

  const handleUpdatePaymentMethod = async (method: string) => {
    // Handle payment method update logic here
    // After updating:
    setTicketToChangePayment(null);
    refreshTickets();
  };

  const renderOrderCard = (ticket: Ticket) => (
    <OrderCard
      key={ticket.id}
      id={ticket.id}
      ticketNumber={ticket.ticketNumber}
      clientName={ticket.clientName}
      phoneNumber={ticket.phoneNumber}
      status={ticket.status}
      createdDate={ticket.createdAt}
      totalPrice={ticket.totalPrice}
      isPaid={ticket.isPaid}
      isSelected={false}
      onSelect={() => {}}
      onMarkAsDelivered={ticket.status === 'ready' ? () => handleTicketDelivered(ticket.id) : undefined}
      onPrint={() => {}}
      onNotify={() => handleSendWhatsAppReminder(ticket)}
    />
  );
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Órdenes Pendientes</CardTitle>
            <Button onClick={refreshTickets}>Actualizar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchFilter={searchFilter}
              setSearchFilter={(filter) => setSearchFilter(filter as 'name' | 'phone')}
              placeholder="Buscar por nombre o teléfono..."
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pendiente <Badge variant="outline" className="ml-2">{filteredPendingTickets.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="ready">
                Listo para Retirar <Badge variant="outline" className="ml-2">{filteredReadyTickets.length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredPendingTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPendingTickets.map(ticket => renderOrderCard(ticket))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <WheatIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes pendientes</h3>
                  <p className="mt-1 text-sm text-gray-500">Todas las órdenes están listas para entregar</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ready" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredReadyTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReadyTickets.map(ticket => renderOrderCard(ticket))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <WheatIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes listas</h3>
                  <p className="mt-1 text-sm text-gray-500">Todas las órdenes están pendientes o ya fueron entregadas</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Cancel Ticket Dialog */}
      {ticketToCancelId && (
        <CancelTicketDialog
          open={!!ticketToCancelId}
          onOpenChange={(open) => {
            if (!open) setTicketToCancelId(null);
          }}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          onCancel={handleCancelConfirm}
        />
      )}
      
      {/* Change Payment Method Dialog */}
      {ticketToChangePayment && (
        <PaymentMethodDialog
          open={!!ticketToChangePayment}
          onOpenChange={(open) => {
            if (!open) setTicketToChangePayment(null);
          }}
          onUpdatePaymentMethod={handleUpdatePaymentMethod}
        />
      )}
    </div>
  );
};

export default PendingOrders;
