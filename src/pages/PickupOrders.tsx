
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import CancelTicketDialog from '@/components/pickup/CancelTicketDialog';
import PickupContainer from '@/components/pickup/PickupContainer';
import PickupLoadingState from '@/components/pickup/PickupLoadingState';
import PickupErrorState from '@/components/pickup/PickupErrorState';
import { getPickupTickets, getTicketServices, cancelTicket } from '@/lib/ticket';
import { toast } from '@/hooks/use-toast';

const PickupOrders = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [ticketServices, setTicketServices] = useState<any[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const queryClient = useQueryClient();
  
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

  const handleOpenCancelDialog = useCallback(() => {
    if (!selectedTicket) {
      toast.error('Error', { description: 'Seleccione un ticket primero' });
      return;
    }
    setCancelReason('');
    setCancelDialogOpen(true);
  }, [selectedTicket]);

  const handleCancelTicket = async () => {
    if (!selectedTicket) return;
    
    if (!cancelReason.trim()) {
      toast.error('Error', { description: 'Por favor ingrese un motivo para anular el ticket' });
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

  if (isLoading) {
    return <PickupLoadingState />;
  }

  if (error) {
    return <PickupErrorState onRetry={refetch} />;
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <PickupContainer
          tickets={tickets}
          onOpenCancelDialog={handleOpenCancelDialog}
          setCancelReason={setCancelReason}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          ticketServices={ticketServices}
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
