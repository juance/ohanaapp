
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from '@/lib/types';
import { AlertCircle, Clock } from 'lucide-react';

interface TicketDetailPanelProps {
  ticket?: Ticket;
  services: any[];
  formatDate: (date: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({ ticket, services, formatDate }) => {
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">Seleccione un ticket</h3>
        <p className="text-gray-500 text-center mt-2">
          Seleccione un ticket para ver sus detalles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Ticket #{ticket.ticketNumber}</h2>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatDate(ticket.createdAt)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{ticket.clientName}</p>
          <p className="text-gray-500">{ticket.phoneNumber}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id} className="flex justify-between items-center py-1 border-b">
                  <div>
                    <p>{service.name}</p>
                    <p className="text-xs text-gray-500">x{service.quantity}</p>
                  </div>
                  <p className="font-medium">${service.price * service.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay servicios registrados</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p>Método de pago</p>
            <p className="capitalize">{ticket.paymentMethod.replace('_', ' ')}</p>
          </div>
          <div className="flex justify-between items-center font-bold mt-2">
            <p>Total</p>
            <p>${ticket.totalPrice}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p>Estado</p>
            <div className={`px-2 py-1 rounded-full text-xs uppercase font-medium
              ${ticket.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                ticket.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                ticket.status === 'ready' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {ticket.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetailPanel;
