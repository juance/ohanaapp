
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Clock, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUnretrievedTickets } from '@/lib/tickets/ticketStatus';
import { toast } from 'sonner';

export function UnretrievedTicketsAlert() {
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return dateString;
    }
  };

  const calculateDaysSince = (dateString: string) => {
    try {
      const ticketDate = new Date(dateString);
      const today = new Date();
      const diffTime = today.getTime() - ticketDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return 0;
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

  const NoTicketsMessage = ({ days }: { days: number }) => (
    <div className="text-center p-4">
      <p className="text-gray-500">No hay tickets sin retirar desde hace {days} días.</p>
    </div>
  );

  const TicketTable = ({ tickets, days }: { tickets: any[], days: number }) => (
    <Table>
      <TableCaption>
        {tickets.length > 0 
          ? `Total: ${tickets.length} tickets sin retirar por más de ${days} días` 
          : `Sin tickets pendientes de ${days} días`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>N° Ticket</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Días sin retirar</TableHead>
          <TableHead>Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell>{ticket.ticketNumber || 'N/A'}</TableCell>
            <TableCell>{ticket.clientName}</TableCell>
            <TableCell>{ticket.phoneNumber}</TableCell>
            <TableCell>{formatDate(ticket.createdAt)}</TableCell>
            <TableCell>
              <Badge className={days >= 90 ? "bg-red-500" : "bg-yellow-500"}>
                {calculateDaysSince(ticket.createdAt)} días
              </Badge>
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleOpenMessageDialog(ticket, days >= 90 ? '90days' : '45days')}
                className="flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Alertas de Tickets No Retirados</span>
          </CardTitle>
          <CardDescription>
            Tickets que no han sido retirados por los clientes después de 45 y 90 días
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center p-4">
              <p>Cargando tickets...</p>
            </div>
          ) : (
            <>
              {/* Alerta de 45 días */}
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Tickets sin retirar por más de 45 días</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {tickets45Days.length > 0 ? (
                    <TicketTable tickets={tickets45Days} days={45} />
                  ) : (
                    <NoTicketsMessage days={45} />
                  )}
                </AlertDescription>
              </Alert>
              
              {/* Alerta de 90 días */}
              <Alert className="border-red-500 bg-red-50">
                <AlertTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Tickets sin retirar por más de 90 días (prendas a donar)</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {tickets90Days.length > 0 ? (
                    <TicketTable tickets={tickets90Days} days={90} />
                  ) : (
                    <NoTicketsMessage days={90} />
                  )}
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={loadUnretrievedTickets} 
                  className="flex items-center gap-1"
                >
                  Actualizar datos
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog para personalizar mensaje de WhatsApp */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar mensaje de WhatsApp</DialogTitle>
            <DialogDescription>
              {messageType === '45days' 
                ? 'Recordatorio a los 45 días de no retirar el pedido'
                : 'Aviso de donación después de 90 días'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Cliente: {selectedTicket?.clientName}</p>
              <p className="text-sm text-gray-500">Teléfono: {selectedTicket?.phoneNumber}</p>
            </div>
            
            <Textarea
              placeholder="Escriba su mensaje aquí..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setMessageDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={sendWhatsAppMessage}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
