
import React from 'react';
import { Ticket } from '@/lib/types';
import PickupHeader from './PickupHeader';
import ActionButtons from './ActionButtons';
import SearchFilters from './SearchFilters';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';

interface PickupContainerProps {
  tickets: Ticket[];
  onOpenCancelDialog: () => void;
  onPrintTicket: () => void;
  onShareWhatsApp: () => void;
  onMarkAsDelivered: (ticketId: string) => void;
  onNotifyClient: () => void;
  setCancelReason: (reason: string) => void;
  selectedTicket: string | null;
  setSelectedTicket: (ticketId: string | null) => void;
  ticketServices: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilter: 'name' | 'phone';
  setSearchFilter: (filter: 'name' | 'phone') => void;
}

const PickupContainer: React.FC<PickupContainerProps> = ({
  tickets,
  onOpenCancelDialog,
  onPrintTicket,
  onShareWhatsApp,
  onMarkAsDelivered,
  onNotifyClient,
  setCancelReason,
  selectedTicket,
  setSelectedTicket,
  ticketServices,
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter
}) => {
  // Find the selected ticket object
  const selectedTicketObj = tickets.find(t => t.id === selectedTicket);

  return (
    <div className="container mx-auto pt-6">
      <PickupHeader />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
        
        <ActionButtons 
          selectedTicket={selectedTicket}
          ticket={selectedTicketObj}
          onNotifyClient={onNotifyClient}
          onPrintTicket={onPrintTicket}
          onShareWhatsApp={onShareWhatsApp}
          onOpenCancelDialog={onOpenCancelDialog}
          onMarkAsDelivered={onMarkAsDelivered}
        />
        
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <TicketList 
              tickets={tickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              searchQuery={searchQuery}
            />
          </div>
          
          <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50">
            <TicketDetail 
              ticket={selectedTicketObj}
              ticketServices={ticketServices}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupContainer;
