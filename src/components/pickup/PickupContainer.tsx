
import React, { useRef, useState } from 'react';
import { Ticket } from '@/lib/types';
import PickupHeader from './PickupHeader';
import ActionButtons from './ActionButtons';
import SearchFilters from './SearchFilters';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import { 
  handleNotifyClient, 
  handleShareWhatsApp, 
  generatePrintContent 
} from '@/components/pickup/ticketActionUtils';
import { toast } from '@/hooks/use-toast';
import { markTicketAsDelivered } from '@/lib/ticket';

interface PickupContainerProps {
  tickets: Ticket[];
  onOpenCancelDialog: () => void;
  setCancelReason: (reason: string) => void;
  selectedTicket: string | null;
  setSelectedTicket: (ticketId: string | null) => void;
  ticketServices: any[];
}

const PickupContainer: React.FC<PickupContainerProps> = ({
  tickets,
  onOpenCancelDialog,
  setCancelReason,
  selectedTicket,
  setSelectedTicket,
  ticketServices
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const ticketDetailRef = useRef<HTMLDivElement>(null);
  
  // Find the selected ticket object
  const selectedTicketObj = tickets.find(t => t.id === selectedTicket);
  
  const handlePrintTicket = () => {
    if (!selectedTicket) {
      toast.error('Error', { description: 'Seleccione un ticket primero' });
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Error', { description: 'Ticket no encontrado' });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Error', { description: 'El navegador bloqueó la apertura de la ventana de impresión' });
      return;
    }

    printWindow.document.write(generatePrintContent(ticket, ticketServices));
    
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
    };
    
    toast.success('Preparando impresión del ticket');
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    const success = await markTicketAsDelivered(ticketId);
    if (success) {
      setSelectedTicket(null);
      toast.success('Ticket marcado como entregado y pagado exitosamente');
    }
  };
  
  const filteredTickets = searchQuery.trim() 
    ? tickets.filter(ticket => {
        if (searchFilter === 'name') {
          return ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        } else { // 'phone'
          return ticket.phoneNumber.includes(searchQuery);
        }
      })
    : tickets;

  return (
    <div className="container mx-auto pt-6">
      <PickupHeader />
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
        
        <ActionButtons 
          selectedTicket={selectedTicket}
          ticket={selectedTicketObj}
          onNotifyClient={handleNotifyClient}
          onPrintTicket={handlePrintTicket}
          onShareWhatsApp={() => handleShareWhatsApp(selectedTicketObj, ticketServices)}
          onOpenCancelDialog={onOpenCancelDialog}
          onMarkAsDelivered={handleMarkAsDelivered}
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
              tickets={filteredTickets}
              selectedTicket={selectedTicket}
              onSelectTicket={setSelectedTicket}
              searchQuery={searchQuery}
            />
          </div>
          
          <div className="md:col-span-3 border rounded-lg p-6 bg-gray-50" ref={ticketDetailRef}>
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
