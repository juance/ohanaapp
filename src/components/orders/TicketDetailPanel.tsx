
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { createDefaultServicesForTicket } from '@/lib/services/ticketMigrationService';
import { toast } from '@/lib/toast';

interface TicketDetailPanelProps {
  selectedTicket: string | null;
  tickets: Ticket[];
  ticketServices: any[];
  formatDate: (dateString: string) => string;
}

const TicketDetailPanel: React.FC<TicketDetailPanelProps> = ({
  selectedTicket,
  tickets,
  ticketServices,
  formatDate
}) => {
  if (!selectedTicket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Seleccione un ticket para ver los detalles</p>
      </div>
    );
  }

  const ticket = tickets.find(t => t.id === selectedTicket);

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Ticket no encontrado</p>
      </div>
    );
  }

  const renderDeliveryInfo = () => {
    if (!selectedTicket) return null;

    const selectedTicketObj = ticket;

    return (
      <div className="mt-4 grid gap-2">
        {selectedTicketObj.status === 'delivered' && selectedTicketObj.deliveredDate && (
          <div className="flex justify-between items-center py-1 border-t border-dashed border-gray-200">
            <span className="text-sm text-gray-500">Entregado:</span>
            <span className="text-sm">{formatDate(selectedTicketObj.deliveredDate)}</span>
          </div>
        )}
      </div>
    );
  };

  // Estado para controlar la carga de servicios
  const [isFixingServices, setIsFixingServices] = useState(false);
  const [fixAttempted, setFixAttempted] = useState(false);

  // Verificar si el ticket tiene servicios directamente
  const hasTicketServices = ticket.dryCleaningItems && ticket.dryCleaningItems.length > 0;
  const hasLoadedServices = ticketServices && ticketServices.length > 0;

  // Usar los servicios del ticket si están disponibles, de lo contrario usar los servicios cargados
  const displayServices = hasTicketServices
    ? ticket.dryCleaningItems.map((item: any) => ({
        id: item.id || `temp-${Math.random()}`,
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price || 0,
        ticketId: ticket.id
      }))
    : hasLoadedServices ? ticketServices : [];

  // Si no hay servicios, crear un servicio por defecto para mostrar
  if (displayServices.length === 0) {
    const quantity = ticket.valetQuantity || 1;
    const price = ticket.totalPrice / quantity;
    displayServices.push({
      id: `default-${Math.random()}`,
      name: quantity > 1 ? 'Valets' : 'Valet',
      quantity: quantity,
      price: price,
      ticketId: ticket.id
    });
  }

  // Función para arreglar los servicios del ticket
  const handleFixServices = async () => {
    if (!ticket || isFixingServices) return;

    setIsFixingServices(true);
    setFixAttempted(true);

    try {
      const success = await createDefaultServicesForTicket(ticket.id, ticket.valetQuantity);

      if (success) {
        toast.success('Servicios creados correctamente');
        // Recargar los servicios
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        toast.error('No se pudieron crear los servicios');
      }
    } catch (error) {
      console.error('Error al arreglar servicios:', error);
      toast.error('Error al crear servicios');
    } finally {
      setIsFixingServices(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Detalles del Ticket</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Número de Ticket</p>
            <p className="font-medium">{ticket.ticketNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">{formatDate(ticket.createdAt)}</p>
          </div>
          {renderDeliveryInfo()}
          <div>
            <p className="text-sm text-gray-500">Estado de Pago</p>
            <Badge variant={ticket.isPaid ? "success" : "outline"}>
              {ticket.isPaid ? "Pagado" : "Pendiente de pago"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Cliente</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{ticket.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{ticket.phoneNumber}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Servicios</h3>
        <div className="space-y-2">
          {displayServices.map(service => (
            <div key={service.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <span className="font-medium">{service.name}</span>
                {service.quantity > 1 && <span className="ml-1 text-sm text-gray-500">x{service.quantity}</span>}
              </div>
              <span className="font-medium">${service.price.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-4">
            <span className="font-bold">Total</span>
            <span className="font-bold text-blue-700">${ticket.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPanel;
