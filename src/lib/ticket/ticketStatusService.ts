
import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Check if a ticket is in a specific status
 * @param status Current status of the ticket
 * @param targetStatus Target status to check
 * @returns True if the ticket is in the given status
 */
export const isInStatus = (status: string, targetStatus: string): boolean => {
  return status.toLowerCase() === targetStatus.toLowerCase();
};

/**
 * Check if a ticket is in delivered status
 * @param status Current status of the ticket
 * @returns True if the ticket is delivered
 */
export const isDelivered = (status: string): boolean => {
  return isInStatus(status, TICKET_STATUS.DELIVERED);
};

/**
 * Check if a ticket is in pending status
 * @param status Current status of the ticket
 * @returns True if the ticket is pending
 */
export const isPending = (status: string): boolean => {
  return isInStatus(status, TICKET_STATUS.PENDING) || 
         isInStatus(status, TICKET_STATUS.PROCESSING) || 
         isInStatus(status, TICKET_STATUS.READY);
};

/**
 * Convert status to display name
 * @param status Ticket status
 * @returns Human-readable status name
 */
export const getStatusDisplayName = (status: string): string => {
  switch (status.toLowerCase()) {
    case TICKET_STATUS.PENDING:
      return 'Pendiente';
    case TICKET_STATUS.PROCESSING:
      return 'En Proceso';
    case TICKET_STATUS.READY:
      return 'Listo para Retirar';
    case TICKET_STATUS.DELIVERED:
      return 'Entregado';
    case TICKET_STATUS.CANCELLED:
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

/**
 * Get CSS class for status badge
 * @param status Ticket status
 * @returns CSS class for the badge
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status.toLowerCase()) {
    case TICKET_STATUS.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case TICKET_STATUS.PROCESSING:
      return 'bg-blue-100 text-blue-800';
    case TICKET_STATUS.READY:
      return 'bg-green-100 text-green-800';
    case TICKET_STATUS.DELIVERED:
      return 'bg-gray-100 text-gray-800';
    case TICKET_STATUS.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get database statuses for SQL queries
 * @returns Array of database statuses
 */
export const getDatabaseStatuses = (): string[] => {
  return [
    TICKET_STATUS.PENDING,
    TICKET_STATUS.PROCESSING,
    TICKET_STATUS.READY,
    TICKET_STATUS.DELIVERED,
    TICKET_STATUS.CANCELLED
  ];
};
