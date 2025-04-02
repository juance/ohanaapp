
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Ticket } from '@/lib/types';
import { 
  getPickupTickets, 
  getTicketServices, 
  markTicketAsDelivered, 
  cancelTicket 
} from '@/lib/ticket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TicketList from '@/components/pickup/TicketList';
import TicketDetail from '@/components/pickup/TicketDetail';
import ActionButtons from '@/components/pickup/ActionButtons';
import SearchFilters from '@/components/pickup/SearchFilters';
import CancelTicketDialog from '@/components/pickup/CancelTicketDialog';
import { 
  handleNotifyClient, 
  handleShareWhatsApp, 
  generatePrintContent 
} from '@/components/pickup/ticketActionUtils';

const PickupOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<'name' | 'phone'>('name');
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();
  const ticketDetailRef = useRef<HTMLDivElement>(null);
  
  const { data: tickets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pickupTickets'],
    queryFn: getPickupTickets,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
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

  const handlePrintTicket = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }

    const ticket = tickets.find(t => t.id === selectedTicket);
    if (!ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('El navegador bloqueó la apertura de la ventana de impresión');
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

  const handleOpenCancelDialog = () => {
    if (!selectedTicket) {
      toast.error('Seleccione un ticket primero');
      return;
    }
    setCancelReason('');
    setCancelDialogOpen(true);
  };

  const handleCancelTicket = async () => {
    if (!selectedTicket) return;
    
    if (!cancelReason.trim()) {
      toast.error('Por favor ingrese un motivo para anular el ticket');
      return;
    }

    const success = await cancelTicket(selectedTicket, cancelReason);
    if (success) {
      setCancelDialogOpen(false);
      setSelectedTicket(null);
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      refetch();
    }
  };

  const handleMarkAsDelivered = async (ticketId: string) => {
    const success = await markTicketAsDelivered(ticketId);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });
      queryClient.invalidateQueries({ queryKey: ['deliveredTickets'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      setSelectedTicket(null);
      refetch();
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

  // Find the selected ticket object
  const selectedTicketObj = tickets.find(t => t.id === selectedTicket);

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
          <button onClick={() => refetch()} className="mt-4">
            Reintentar
          </button>
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
            <h2 className="text-xl font-bold mb-4">Pedidos a Retirar</h2>
            
            <ActionButtons 
              selectedTicket={selectedTicket}
              ticket={selectedTicketObj}
              onNotifyClient={handleNotifyClient}
              onPrintTicket={handlePrintTicket}
              onShareWhatsApp={() => handleShareWhatsApp(selectedTicketObj, ticketServices)}
              onOpenCancelDialog={handleOpenCancelDialog}
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
