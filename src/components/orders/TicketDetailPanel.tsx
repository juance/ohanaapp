import React from 'react';
import { Ticket } from '@/lib/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface TicketDetailPanelProps {
  ticket?: Ticket;
  tickets?: Ticket[];
  selectedTicket?: string | null;
  ticketServices?: any[];
  formatDate?: (date: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({
  ticket,
  tickets,
  selectedTicket,
  ticketServices,
  formatDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: es });
    } catch (e) {
      return date;
    }
  }
}) => {
  // If we receive a direct ticket object, use it
  // Otherwise, find the ticket in the tickets array using selectedTicket
  const ticketToShow = ticket || (
    selectedTicket && tickets 
      ? tickets.find(t => t.id === selectedTicket) 
      : undefined
  );

  if (!ticketToShow) {
    return (
      <div className="flex h-[500px] items-center justify-center text-gray-400">
        <p>Seleccione un ticket para ver los detalles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Detalles del Ticket</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Número de Ticket</p>
            <p className="font-medium">{ticketToShow.ticketNumber}</p>
          </div>
          {ticketToShow.basketTicketNumber && (
            <div>
              <p className="text-sm text-gray-500">Número de Canasta</p>
              <p className="font-medium">{ticketToShow.basketTicketNumber}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{ticketToShow.clientName || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{ticketToShow.phoneNumber || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <div className={`inline-block rounded-full px-2 py-1 text-xs text-white ${
              ticketToShow.status === 'delivered' ? 'bg-green-500' : 
              ticketToShow.status === 'ready' ? 'bg-yellow-500' : 
              ticketToShow.status === 'processing' ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              {ticketToShow.status === 'delivered' ? 'Entregado' : 
               ticketToShow.status === 'ready' ? 'Listo para retirar' : 
               ticketToShow.status === 'processing' ? 'En proceso' : 'Pendiente'}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pago</p>
            <div className={`inline-block rounded-full px-2 py-1 text-xs ${
              ticketToShow.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {ticketToShow.isPaid ? 'Pagado' : 'Pendiente'}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Método de pago</p>
            <p className="font-medium capitalize">{ticketToShow.paymentMethod || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">${ticketToShow.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de creación</p>
            <p className="font-medium">{formatDate(ticketToShow.createdAt)}</p>
          </div>
          {ticketToShow.deliveredDate && (
            <div>
              <p className="text-sm text-gray-500">Fecha de entrega</p>
              <p className="font-medium">{formatDate(ticketToShow.deliveredDate)}</p>
            </div>
          )}
          {ticketToShow.valetQuantity > 0 && (
            <div>
              <p className="text-sm text-gray-500">Cantidad de valets</p>
              <p className="font-medium">{ticketToShow.valetQuantity}</p>
            </div>
          )}
        </div>
      </div>

      {/* Servicios */}
      {ticketToShow.dryCleaningItems && ticketToShow.dryCleaningItems.length > 0 && (
        <div>
          <h4 className="mb-2 text-md font-medium">Artículos de tintorería</h4>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artículo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ticketToShow.dryCleaningItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.quantity}</td>
                    <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-2">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Services from ticketServices prop */}
      {ticketServices && ticketServices.length > 0 && (
        <div>
          <h4 className="mb-2 text-md font-medium">Servicios adicionales</h4>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ticketServices.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-2">{service.name}</td>
                    <td className="px-4 py-2">{service.quantity || 1}</td>
                    <td className="px-4 py-2">${service.price?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-2">${((service.price || 0) * (service.quantity || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPanel;
