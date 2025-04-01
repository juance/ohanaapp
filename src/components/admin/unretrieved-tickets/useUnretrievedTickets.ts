
import { useState, useEffect } from 'react';
import { getUnretrievedTickets } from '@/lib/tickets/ticketStatus';
import { toast } from 'sonner';

export function useUnretrievedTickets() {
  const [tickets45Days, setTickets45Days] = useState<any[]>([]);
  const [tickets90Days, setTickets90Days] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messageType, setMessageType] = useState<'45days' | '90days'>('45days');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    loadUnretrievedTickets();
  }, []);

  const loadUnretrievedTickets = async () => {
    setIsLoading(true);
    try {
      const { tickets45Days, tickets90Days } = await getUnretrievedTickets();
      setTickets45Days(tickets45Days);
      setTickets90Days(tickets90Days);
    } catch (error) {
      console.error('Error al cargar tickets no retirados:', error);
      toast.error('Error al cargar tickets no retirados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMessageDialog = (ticket: any, type: '45days' | '90days') => {
    setSelectedTicket(ticket);
    setMessageType(type);
    
    // Set default message based on type
    if (type === '45days') {
      setCustomMessage(
        `Hola ${ticket.clientName}, le recordamos que su pedido en Lavandería Ohana está listo para retirar desde hace 45 días. Por favor, pase a retirarlo a la brevedad. ¡Gracias!`
      );
    } else {
      setCustomMessage(
        `Hola ${ticket.clientName}, le informamos que su pedido en Lavandería Ohana lleva 90 días sin ser retirado. Si no pasa a retirarlo en los próximos 7 días, las prendas serán donadas conforme a nuestra política. ¡Gracias!`
      );
    }
    
    setMessageDialogOpen(true);
  };

  const sendWhatsAppMessage = () => {
    if (!selectedTicket) return;
    
    const phoneNumber = selectedTicket.phoneNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast.success(`Mensaje preparado para enviar a ${selectedTicket.clientName}`);
    setMessageDialogOpen(false);
  };

  return {
    tickets45Days,
    tickets90Days,
    isLoading,
    messageDialogOpen,
    setMessageDialogOpen,
    selectedTicket,
    messageType,
    customMessage,
    setCustomMessage,
    loadUnretrievedTickets,
    handleOpenMessageDialog,
    sendWhatsAppMessage
  };
}
