
import React from 'react';
import { Ticket } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TicketDetailPanelProps {
  ticket?: Ticket;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ ticket }) => {
  if (!ticket) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Seleccione un ticket para ver los detalles</p>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pendiente' },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'En proceso' },
      'ready': { color: 'bg-green-100 text-green-800', label: 'Listo para retirar' },
      'delivered': { color: 'bg-gray-100 text-gray-800', label: 'Entregado' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <Badge className={`${statusInfo.color} font-normal`}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div>
      <CardHeader className="px-0">
        <div className="flex justify-between items-center">
          <CardTitle>Detalles del Ticket #{ticket.ticketNumber}</CardTitle>
          {getStatusBadge(ticket.status)}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Cliente:</span>
                <span>{ticket.clientName || ticket.customerName || 'No especificado'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Teléfono:</span>
                <span>{ticket.phoneNumber || ticket.customerPhone || 'No especificado'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Estado de pago:</span>
                <span>
                  <Badge variant={ticket.isPaid ? "success" : "outline"}>
                    {ticket.isPaid ? 'Pagado' : 'Pendiente de pago'}
                  </Badge>
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Método de pago:</span>
                <span>{ticket.paymentMethod || 'No especificado'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de creación:</span>
                <span>{formatDate(ticket.createdAt)}</span>
              </div>

              {ticket.deliveredDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha de entrega:</span>
                  <span>{formatDate(ticket.deliveredDate)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg">Detalle de servicios</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Tintorería:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {ticket.dryCleaningItems.map((item, index) => (
                    <li key={index}>
                      {item.name} x{item.quantity}: ${item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            ) : ticket.valetQuantity ? (
              <div>
                <h4 className="font-medium">Valet:</h4>
                <p>Cantidad: {ticket.valetQuantity}</p>
              </div>
            ) : (
              <p className="text-gray-500">No hay servicios detallados</p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-lg">${ticket.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default TicketDetailPanel;
