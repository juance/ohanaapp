
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
  isLoadingServices?: boolean;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ 
  ticket, 
  services,
  formatDate,
  isLoadingServices = false
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

  const getPaymentMethodLabel = (method: string) => {
    const paymentMethods: Record<string, string> = {
      'cash': 'Efectivo',
      'efectivo': 'Efectivo',
      'debit': 'Tarjeta de Débito',
      'mercadopago': 'Mercado Pago',
      'cuenta_dni': 'Cuenta DNI'
    };
    return paymentMethods[method] || method;
  };

  // Check if we have any services to display
  const hasDryCleaningItems = services?.dryCleaningItems && services.dryCleaningItems.length > 0;
  const hasLaundryOptions = services?.laundryOptions && services.laundryOptions.length > 0;
  const hasAnyServices = hasDryCleaningItems || hasLaundryOptions;

  console.log('TicketDetailPanel - Services data:', {
    services,
    hasDryCleaningItems,
    hasLaundryOptions,
    hasAnyServices,
    isLoadingServices
  });

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

        {/* Servicios */}
        <div>
          <h4 className="font-semibold text-sm text-gray-600 mb-2">SERVICIOS</h4>
          
          {isLoadingServices ? (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">Cargando servicios...</p>
            </div>
          ) : (
            <>
              {/* Servicios de Tintorería */}
              {hasDryCleaningItems && (
                <div className="mb-4">
                  <h5 className="font-medium text-xs text-gray-500 mb-2">TINTORERÍA</h5>
                  <div className="space-y-2">
                    {services.dryCleaningItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Cantidad: {item.quantity} | Precio unitario: {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-green-600">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opciones de Lavandería */}
              {hasLaundryOptions && (
                <div className="mb-4">
                  <h5 className="font-medium text-xs text-gray-500 mb-2">LAVANDERÍA</h5>
                  <div className="flex flex-wrap gap-2">
                    {services.laundryOptions.map((option) => (
                      <Badge key={option.id} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        {option.option_type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de Valets */}
              {ticket.valetQuantity > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-xs text-gray-500 mb-2">VALETS</h5>
                  <div className="py-2 px-3 bg-yellow-50 rounded-md">
                    <p className="text-sm font-medium text-yellow-800">Cantidad: {ticket.valetQuantity}</p>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay servicios */}
              {!hasAnyServices && ticket.valetQuantity === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p className="text-sm">No se encontraron servicios asociados a este ticket</p>
                </div>
              )}
            </>
          )}
        </div>

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
              <span className="text-sm">{getPaymentMethodLabel(ticket.paymentMethod)}</span>
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
