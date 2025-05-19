
import { format } from 'date-fns';
import { Ticket } from '@/lib/types';
import { TicketService } from '@/lib/types/ticket.types';
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Format date string for display in tickets
 */
export const formatTicketDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Fecha inválida';
  }
};

/**
 * Create a test ticket for development
 */
export const createTestTicket = (): Ticket => {
  return {
    id: 'test-12345',
    ticketNumber: 'T-123',
    clientName: 'Cliente de Prueba',
    phoneNumber: '123456789',
    total: 1500,
    totalPrice: 1500,
    paymentMethod: 'cash',
    status: TICKET_STATUS.READY,
    isPaid: false,
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
    valetQuantity: 2,
    // No usesFreeValet property
  };
};

/**
 * Format services for display
 */
export const formatTicketServices = (services?: TicketService[]): string => {
  if (!services || services.length === 0) return 'No hay servicios registrados';
  
  return services.map(service => 
    `${service.name} (${service.quantity}) - $${service.price}`
  ).join(', ');
};

/**
 * Format ticket data for display and printing
 * This replaces missing formatTicketData references
 */
export const formatTicketData = (ticket: Ticket) => {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    basketTicketNumber: ticket.basketTicketNumber,
    clientName: ticket.clientName,
    phoneNumber: ticket.phoneNumber,
    date: formatTicketDate(ticket.date),
    deliveredDate: ticket.deliveredDate ? formatTicketDate(ticket.deliveredDate) : 'Pendiente',
    valetQuantity: ticket.valetQuantity,
    services: formatTicketServices(ticket.services),
    total: ticket.total.toLocaleString(),
    isPaid: ticket.isPaid ? 'Si' : 'No',
    paymentMethod: formatPaymentMethod(ticket.paymentMethod),
    status: ticket.status
  };
};

/**
 * Format payment method for display
 */
const formatPaymentMethod = (method?: string): string => {
  if (!method) return 'No especificado';
  
  switch (method) {
    case 'cash': return 'Efectivo';
    case 'debit': return 'Tarjeta de débito';
    case 'mercadopago': return 'Mercado Pago';
    case 'cuenta_dni': return 'Cuenta DNI';
    default: return method;
  }
};
