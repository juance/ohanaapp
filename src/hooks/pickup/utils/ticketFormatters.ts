
import { Ticket, LaundryOption, DryCleaningItem, TicketService } from '@/lib/types';

/**
 * Maps database ticket data to Ticket format
 */
export const formatTicketData = (
  ticketData: any, 
  dryCleaningItems: DryCleaningItem[]
): Ticket => {
  return {
    id: ticketData.id,
    ticketNumber: ticketData.ticket_number,
    clientName: ticketData.customers?.name || '',
    phoneNumber: ticketData.customers?.phone || '',
    total: ticketData.total || 0,
    totalPrice: ticketData.total || 0,
    status: ticketData.status,
    paymentMethod: ticketData.payment_method,
    date: ticketData.date,
    isPaid: ticketData.is_paid,
    createdAt: ticketData.created_at,
    deliveredDate: ticketData.delivered_date,
    basketTicketNumber: ticketData.basket_ticket_number || '',
    services: mapDryCleaningItemsToServices(dryCleaningItems),
    valetQuantity: ticketData.valet_quantity || 0,
    // Agregar explícitamente dryCleaningItems para acceso directo
    dryCleaningItems: dryCleaningItems
  };
};

/**
 * Maps dry cleaning items to ticket services
 */
export const mapDryCleaningItemsToServices = (
  items: DryCleaningItem[]
): TicketService[] => {
  // Si no hay elementos o está vacío, devolver array vacío
  if (!items || items.length === 0) {
    return [];
  }
  
  // Mapear los items a servicios
  return items.map(item => ({
    id: item.id,
    name: item.name || 'Servicio',  // Proporcionar un nombre por defecto si es vacío
    price: item.price || 0,
    quantity: item.quantity || 1
  }));
};
