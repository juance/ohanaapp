
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
