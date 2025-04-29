
// Servicios para manejar los estados de tickets
import { Ticket } from '@/lib/types';

/**
 * Verifica si un ticket está entregado basado en su estado
 */
export const isDelivered = (status?: string): boolean => {
  return status === 'delivered';
};

/**
 * Verifica si un ticket está pendiente/en progreso
 */
export const isPending = (status?: string): boolean => {
  return status === 'pending' || 
         status === 'processing' || 
         status === 'ready';
};

/**
 * Verifica si un ticket tiene un estado específico
 */
export const isInStatus = (ticket: Ticket, status: string | string[]): boolean => {
  const statuses = Array.isArray(status) ? status : [status];
  return statuses.includes(ticket.status);
};

/**
 * Devuelve una lista de estados posibles para la base de datos
 */
export const getDatabaseStatuses = (): string[] => {
  return ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
};

/**
 * Obtiene el nombre para mostrar de un estado
 */
export const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'En proceso';
    case 'ready':
      return 'Listo para retirar';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

/**
 * Obtiene la clase de badge para un estado
 */
export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Funciones para mapeo de estados que faltan en los tests
export const mapToSimplifiedStatus = (status?: string): string => {
  if (!status) return 'pending';
  
  switch (status) {
    case 'delivered':
      return 'delivered';
    case 'pending':
    case 'processing': 
    case 'ready':
      return 'pending';
    default:
      return 'pending';
  }
};

export const mapToDatabaseStatus = (status?: string): string => {
  if (!status) return 'pending';
  
  switch (status) {
    case 'pending':
      return 'pending';
    case 'processing':
      return 'processing';
    case 'ready':
      return 'ready';
    case 'delivered':
      return 'delivered';
    default:
      return 'pending';
  }
};

export const moveToNextStatus = (currentStatus?: string): string => {
  if (!currentStatus) return 'processing';
  
  switch (currentStatus) {
    case 'pending':
      return 'processing';
    case 'processing':
      return 'ready';
    case 'ready':
      return 'delivered';
    case 'delivered':
      return 'delivered'; // No hay siguiente estado después de entregado
    default:
      return 'processing';
  }
};
