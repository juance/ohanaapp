
import React from 'react';
import { Ticket, TicketService } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, Calendar, CreditCard, AlertCircle } from 'lucide-react';

interface TicketDetailPanelProps {
  ticket?: Ticket;
  services: TicketService[];
  formatDate: (dateString: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ ticket, services, formatDate }) => {
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500">Seleccione un ticket</h3>
        <p className="text-sm text-gray-400 mt-2">
          Los detalles del ticket se mostrarán aquí
        </p>
      </div>
    );
  }

  // Format payment method for display
  const getPaymentMethodText = (method?: string): string => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'debit': return 'Débito';
      case 'mercadopago': return 'Mercado Pago';
      case 'cuenta_dni': return 'Cuenta DNI';
      default: return 'No especificado';
    }
  };

  // Determine which services to display with a preference order
  // 1. Use provided services if available
  // 2. Use ticket.dryCleaningItems if available
  // 3. Fall back to ticket.services
  let displayServices: TicketService[] = [];
  
  if (services && services.length > 0) {
    displayServices = services;
  } else if (ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0) {
    displayServices = ticket.dryCleaningItems.map(item => ({
      id: item.id,
      name: item.name || 'Servicio',
      price: item.price || 0,
      quantity: item.quantity || 1
    }));
  } else if (ticket.services && ticket.services.length > 0) {
    displayServices = ticket.services;
  }
  
  // Si no hay servicios y es un ticket, crear un servicio por defecto
  if (displayServices.length === 0) {
    displayServices = [{
      id: 'default-service',
      name: 'Servicio general',
      price: ticket.totalPrice || 0,
      quantity: 1
    }];
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">Ticket #{ticket.ticketNumber}</h2>
          <div className="text-sm text-gray-500">
            {ticket.clientName || 'Cliente sin nombre'}
          </div>
        </div>

        <Badge variant={ticket.status === 'ready' ? 'success' : 'outline'}>
          {ticket.status === 'ready' ? 'Listo para entrega' : 
           ticket.status === 'processing' ? 'En proceso' : 'Pendiente'}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Información del ticket</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{ticket.phoneNumber || 'Sin teléfono'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{formatDate(ticket.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{getPaymentMethodText(ticket.paymentMethod)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={ticket.isPaid ? "success" : "outline"} className="text-xs">
                {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-3">Servicios</h3>
        <Card>
          <CardContent className="p-4">
            <div className="divide-y">
              {displayServices.map((service, index) => (
                <div key={service.id || `service-${index}`} className="py-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{service.name || 'Servicio'}</div>
                    <div className="text-sm text-gray-500">
                      Cantidad: {service.quantity || 1}
                    </div>
                  </div>
                  <div className="font-medium">
                    $ {service.price?.toLocaleString() || '0'}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center font-bold">
              <span>Total:</span>
              <span>$ {ticket.totalPrice?.toLocaleString() || '0'}</span>
            </div>
            
            {ticket.basketTicketNumber && (
              <div className="mt-4 text-center bg-gray-100 py-2 rounded-md">
                <span className="font-medium">Ticket de canasta: #{ticket.basketTicketNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetailPanel;
