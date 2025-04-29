
// Crear un archivo index.ts en la raíz para exportar las constantes principales
export { TICKET_STATUS } from '@/lib/constants/appConstants';

// Si hay otras exportaciones importantes para tests, incluirlas aquí
export { mapToSimplifiedStatus, mapToDatabaseStatus, moveToNextStatus } from '@/lib/ticket/ticketStatusService';
