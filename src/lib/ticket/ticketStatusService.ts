
// Ticket status management utilities

type DatabaseStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
type SimplifiedStatus = 'pending' | 'ready' | 'completed' | 'cancelled';

// Map database status to simplified UI status
export const mapToSimplifiedStatus = (status: DatabaseStatus): SimplifiedStatus => {
  switch (status) {
    case 'pending':
    case 'processing':
      return 'pending';
    case 'ready':
      return 'ready';
    case 'delivered':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Map simplified status to database status
export const mapToDatabaseStatus = (status: SimplifiedStatus): DatabaseStatus => {
  switch (status) {
    case 'pending':
      return 'processing';
    case 'ready':
      return 'ready';
    case 'completed':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Get all database statuses
export const getDatabaseStatuses = (): DatabaseStatus[] => {
  return ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
};

// Check if a ticket is in a specific status
export const isInStatus = (ticket: any, status: DatabaseStatus | DatabaseStatus[]): boolean => {
  if (Array.isArray(status)) {
    return status.includes(ticket.status);
  }
  return ticket.status === status;
};

// Get display name for status
export const getStatusDisplayName = (status: DatabaseStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'En Proceso';
    case 'ready':
      return 'Listo para Retirar';
    case 'delivered':
      return 'Entregado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

// Get badge class for status
export const getStatusBadgeClass = (status: DatabaseStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Move a ticket to the next status in the workflow
export const moveToNextStatus = (currentStatus: DatabaseStatus): DatabaseStatus => {
  switch (currentStatus) {
    case 'pending':
      return 'processing';
    case 'processing':
      return 'ready';
    case 'ready':
      return 'delivered';
    default:
      return currentStatus;
  }
};
