
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

/**
 * Map ticket status to simplified status
 * @param status The database status
 * @returns Simplified status (PENDING, READY, DELIVERED)
 */
export const mapToSimplifiedStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case TICKET_STATUS.PENDING:
    case TICKET_STATUS.PROCESSING:
      return 'PENDING';
    case TICKET_STATUS.READY:
      return 'READY';
    case TICKET_STATUS.DELIVERED:
      return 'DELIVERED';
    case TICKET_STATUS.CANCELLED:
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
};

/**
 * Map simplified status to database status
 * @param simplifiedStatus The simplified status
 * @param currentStatus The current status (for preserving specific pending state)
 * @returns The database status
 */
export const mapToDatabaseStatus = (simplifiedStatus: string, currentStatus?: string): string => {
  switch (simplifiedStatus) {
    case 'PENDING':
      // If we have a specific pending status (like 'processing'), preserve it
      if (currentStatus && (currentStatus === 'pending' || currentStatus === 'processing')) {
        return currentStatus;
      }
      return 'ready';
    case 'DELIVERED':
      return 'delivered';
    case 'CANCELLED':
      return 'canceled';
    default:
      return 'ready';
  }
};

/**
 * Move a ticket to the next status in the workflow
 * @param ticket Ticket to update
 * @returns Updated ticket with new status
 */
export const moveToNextStatus = (ticket: { id: string, status: string }): { id: string, status: string } => {
  const currentStatus = ticket.status.toLowerCase();
  
  switch (currentStatus) {
    case TICKET_STATUS.PENDING:
      return { ...ticket, status: TICKET_STATUS.PROCESSING };
    case TICKET_STATUS.PROCESSING:
      return { ...ticket, status: TICKET_STATUS.READY };
    case TICKET_STATUS.READY:
      return { ...ticket, status: TICKET_STATUS.DELIVERED };
    default:
      return ticket; // No change for delivered tickets
  }
};

/**
 * Get the next status in the workflow
 * @param currentStatus Current ticket status
 * @returns Next status in the workflow
 */
export const getNextStatus = (currentStatus: string): string => {
  switch (currentStatus.toLowerCase()) {
    case TICKET_STATUS.PENDING:
      return TICKET_STATUS.PROCESSING;
    case TICKET_STATUS.PROCESSING:
      return TICKET_STATUS.READY;
    case TICKET_STATUS.READY:
      return TICKET_STATUS.DELIVERED;
    default:
      return currentStatus; // No change for delivered tickets
  }
};
