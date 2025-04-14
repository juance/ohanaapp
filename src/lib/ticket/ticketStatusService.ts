
/**
 * Ticket Status Service
 *
 * This module provides a unified interface for working with ticket statuses.
 * It simplifies the ticket status workflow and provides helper functions
 * for status transitions and validation.
 */

import { TICKET_STATUS } from '@/lib/constants/appConstants';

/**
 * Simplified ticket status type
 * We use only two main statuses for tickets:
 * - PENDING: Tickets that are waiting to be picked up (includes 'pending', 'processing', and 'ready')
 * - DELIVERED: Tickets that have been delivered to the customer
 */
export type TicketStatusSimplified = 'PENDING' | 'DELIVERED';

/**
 * Maps a database status to a simplified status
 * @param dbStatus The status as stored in the database
 * @returns The simplified status (PENDING or DELIVERED)
 */
export const mapToSimplifiedStatus = (dbStatus: string): TicketStatusSimplified => {
  console.log('Mapping DB status to simplified status:', dbStatus);
  if (dbStatus === TICKET_STATUS.DELIVERED) {
    return 'DELIVERED';
  }
  // All non-delivered statuses are considered PENDING
  return 'PENDING';
};

/**
 * Maps a simplified status to the appropriate database status
 * @param simplifiedStatus The simplified status (PENDING or DELIVERED)
 * @param currentDbStatus Optional current database status to determine the correct pending status
 * @returns The database status to use
 */
export const mapToDatabaseStatus = (
  simplifiedStatus: TicketStatusSimplified,
  currentDbStatus?: string
): string => {
  if (simplifiedStatus === 'DELIVERED') {
    return TICKET_STATUS.DELIVERED;
  }

  // If we're setting to PENDING, preserve the current pending status if it exists
  if (currentDbStatus && [
    TICKET_STATUS.PENDING,
    TICKET_STATUS.PROCESSING,
    TICKET_STATUS.READY
  ].includes(currentDbStatus as any)) {
    return currentDbStatus;
  }

  // Default to READY for new tickets to make them appear in the pickup page
  return TICKET_STATUS.READY;
};

/**
 * Checks if a ticket is in a specific simplified status
 * @param dbStatus The database status
 * @param simplifiedStatus The simplified status to check against
 * @returns True if the database status maps to the simplified status
 */
export const isInStatus = (dbStatus: string, simplifiedStatus: TicketStatusSimplified): boolean => {
  return mapToSimplifiedStatus(dbStatus) === simplifiedStatus;
};

/**
 * Checks if a ticket is pending (not delivered)
 * @param dbStatus The database status
 * @returns True if the ticket is pending
 */
export const isPending = (dbStatus: string): boolean => {
  return isInStatus(dbStatus, 'PENDING');
};

/**
 * Checks if a ticket is delivered
 * @param dbStatus The database status
 * @returns True if the ticket is delivered
 */
export const isDelivered = (dbStatus: string): boolean => {
  return isInStatus(dbStatus, 'DELIVERED');
};

/**
 * Gets all database statuses that map to a simplified status
 * @param simplifiedStatus The simplified status
 * @returns Array of database statuses
 */
export const getDatabaseStatuses = (simplifiedStatus: TicketStatusSimplified): string[] => {
  if (simplifiedStatus === 'DELIVERED') {
    return [TICKET_STATUS.DELIVERED];
  }
  return [TICKET_STATUS.PENDING, TICKET_STATUS.PROCESSING, TICKET_STATUS.READY];
};

/**
 * Gets the display name for a ticket status
 * @param status The database status
 * @returns A user-friendly display name
 */
export const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case TICKET_STATUS.DELIVERED:
      return 'Entregado';
    case TICKET_STATUS.READY:
      return 'Listo para retirar';
    case TICKET_STATUS.PROCESSING:
      return 'En proceso';
    case TICKET_STATUS.PENDING:
      return 'Pendiente';
    default:
      return 'Desconocido';
  }
};

/**
 * Gets the CSS class for a status badge
 * @param status The database status
 * @returns CSS class for styling the status badge
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case TICKET_STATUS.DELIVERED:
      return 'bg-green-500 hover:bg-green-600';
    case TICKET_STATUS.READY:
      return 'bg-yellow-500 hover:bg-yellow-600';
    case TICKET_STATUS.PROCESSING:
      return 'bg-blue-500 hover:bg-blue-600';
    case TICKET_STATUS.PENDING:
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return 'bg-gray-500 hover:bg-gray-600';
  }
};
