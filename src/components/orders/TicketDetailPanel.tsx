
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

  // Combine ticket.services with received services if needed
  const displayServices = services && services.length > 0 ? services : (ticket.services || []);
  
  // Get dry cleaning items from ticket
  const dryCleaningItems = ticket.dryCleaningItems || [];
  const hasDryCleaningItems = dryCleaningItems.length > 0;
  
  // Debug log to see the items available
  console.log('Ticket detail panel services:', { 
    propsServices: services, 
    ticketServices: ticket.services,
    dryCleaningItems: ticket.dryCleaningItems,
    displayServices
  });

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
        {/* Display services from props, ticket.services, or ticket.dryCleaningItems */}
        {(displayServices.length > 0 || hasDryCleaningItems) ? (
          <Card>
            <CardContent className="p-4">
              <div className="divide-y">
                {/* Display regular services */}
                {displayServices.map((service) => (
                  <div key={service.id || `service-${service.name}`} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        Cantidad: {service.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      $ {service.price}
                    </div>
                  </div>
                ))}
                
                {/* Display dry cleaning items if they exist */}
                {hasDryCleaningItems && dryCleaningItems.map((item) => (
                  <div key={item.id || `item-${item.name}`} className="py-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Cantidad: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      $ {item.price}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>$ {ticket.totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border">
            <p className="text-gray-500">No hay servicios registrados para este ticket</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailPanel;
