
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ticket, LaundryOption } from '@/lib/types';

interface TicketPrintContentProps {
  ticket: Ticket;
  laundryOptions?: LaundryOption[];
  logoUrl?: string;
}

const TicketPrintContent: React.FC<TicketPrintContentProps> = ({
  ticket,
  laundryOptions,
  logoUrl
}) => {
  const services = ticket.services || [];
  
  const formatDate = (date: string) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  return (
    <div className="bg-white p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-4">
        {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 mx-auto mb-2" />}
        <h1 className="text-xl font-bold">Lavandería Express</h1>
        <p className="text-sm">Av. Principal 123, Ciudad</p>
        <p className="text-sm">Tel: (123) 456-7890</p>
      </div>

      {/* Ticket Info */}
      <div className="border-t border-b border-gray-300 py-2 mb-4">
        <p className="text-center font-bold">Ticket #{ticket.ticketNumber}</p>
        <p className="text-center text-sm">{formatDate(ticket.createdAt)}</p>
      </div>

      {/* Customer Info */}
      <div className="mb-4">
        <p><strong>Cliente:</strong> {ticket.clientName}</p>
        <p><strong>Teléfono:</strong> {ticket.phoneNumber}</p>
      </div>

      {/* Services */}
      {services && services.length > 0 ? (
        <div className="mb-4">
          <h2 className="font-bold border-b border-gray-300 pb-1 mb-2">Servicios</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-1">Detalle</th>
                <th className="text-center py-1">Cant</th>
                <th className="text-right py-1">Precio</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-gray-100">
                  <td className="py-1">{service.name}</td>
                  <td className="text-center py-1">{service.quantity}</td>
                  <td className="text-right py-1">${service.price}</td>
                  <td className="text-right py-1">${service.price * service.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ticket.valetQuantity && ticket.valetQuantity > 0 ? (
          <div className="mb-4">
            <h2 className="font-bold border-b border-gray-300 pb-1 mb-2">Servicios</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1">Detalle</th>
                  <th className="text-center py-1">Cant</th>
                  <th className="text-right py-1">Precio</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1">Servicio de valet</td>
                  <td className="text-center py-1">{ticket.valetQuantity}</td>
                  <td className="text-right py-1">${(ticket.totalPrice / ticket.valetQuantity).toFixed(2)}</td>
                  <td className="text-right py-1">${ticket.totalPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mb-4 text-center italic text-gray-500">
            No hay servicios registrados
          </div>
        )
      )}

      {/* Laundry Options */}
      {laundryOptions && laundryOptions.length > 0 && (
        <div className="mb-4">
          <h2 className="font-bold border-b border-gray-300 pb-1 mb-2">Opciones</h2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {laundryOptions.map((option) => (
              <div key={option.id} className="flex items-center">
                <span className="mr-1">✓</span>
                <span>{option.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Info */}
      <div className="mb-4">
        <div className="flex justify-between font-bold border-t border-b border-gray-300 py-1">
          <span>TOTAL:</span>
          <span>${ticket.totalPrice}</span>
        </div>
        <p className="text-sm mt-1"><strong>Método de pago:</strong> {ticket.paymentMethod}</p>
        <p className="text-sm"><strong>Estado:</strong> {ticket.isPaid ? 'Pagado' : 'Pendiente'}</p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs mt-6">
        <p>Gracias por su preferencia</p>
        <p className="mt-1">www.lavanderiaexpress.com</p>
      </div>
    </div>
  );
};

export default TicketPrintContent;
