
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface TicketDetailPanelProps {
  ticket?: {
    id: string;
    ticketNumber: string;
    clientName: string;
    phoneNumber: string;
    total: number;
    paymentMethod: string;
    status: string;
    date: string;
    deliveredDate?: string;
    isPaid: boolean;
    valetQuantity: number;
  };
  services?: {
    dryCleaningItems: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    laundryOptions: Array<{
      id: string;
      option_type: string;
    }>;
  };
  formatDate: (date: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ 
  ticket, 
  services,
  formatDate 
}) => {
  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Selecciona un ticket para ver los detalles</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'Pendiente', variant: 'secondary' as const },
      'ready': { label: 'Listo', variant: 'default' as const },
      'delivered': { label: 'Entregado', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Debug: log para verificar los servicios
  console.log('Services in TicketDetailPanel:', services);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ticket #{ticket.ticketNumber}</span>
          {getStatusBadge(ticket.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del Cliente */}
        <div>
          <h4 className="font-semibold text-sm text-gray-600 mb-2">CLIENTE</h4>
          <p className="font-medium">{ticket.clientName}</p>
          <p className="text-sm text-gray-600">{ticket.phoneNumber}</p>
        </div>

        <Separator />

        {/* Servicios de Tintorería */}
        {services?.dryCleaningItems && services.dryCleaningItems.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">SERVICIOS DE TINTORERÍA</h4>
            <div className="space-y-2">
              {services.dryCleaningItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opciones de Lavandería */}
        {services?.laundryOptions && services.laundryOptions.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">OPCIONES DE LAVANDERÍA</h4>
            <div className="flex flex-wrap gap-2">
              {services.laundryOptions.map((option) => (
                <Badge key={option.id} variant="outline" className="text-xs">
                  {option.option_type}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Debug: mostrar si no hay servicios */}
        {(!services?.dryCleaningItems || services.dryCleaningItems.length === 0) && 
         (!services?.laundryOptions || services.laundryOptions.length === 0) && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">SERVICIOS</h4>
            <p className="text-sm text-gray-500">No se encontraron servicios asociados a este ticket</p>
            {/* Debug info */}
            <details className="mt-2 text-xs text-gray-400">
              <summary>Debug info</summary>
              <pre>{JSON.stringify(services, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* Información de Valets */}
        {ticket.valetQuantity > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-600 mb-2">VALETS</h4>
            <p className="text-sm">Cantidad: {ticket.valetQuantity}</p>
          </div>
        )}

        <Separator />

        {/* Información de Pago */}
        <div>
          <h4 className="font-semibold text-sm text-gray-600 mb-2">PAGO</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">Total:</span>
              <span className="font-semibold">{formatCurrency(ticket.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Método:</span>
              <span className="text-sm">{ticket.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Estado:</span>
              <Badge variant={ticket.isPaid ? "default" : "secondary"} className="text-xs">
                {ticket.isPaid ? 'Pagado' : 'Pendiente'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Fechas */}
        <div>
          <h4 className="font-semibold text-sm text-gray-600 mb-2">FECHAS</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Creado:</span>
              <span>{formatDate(ticket.date)}</span>
            </div>
            {ticket.deliveredDate && (
              <div className="flex justify-between text-sm">
                <span>Entregado:</span>
                <span>{formatDate(ticket.deliveredDate)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDetailPanel;
