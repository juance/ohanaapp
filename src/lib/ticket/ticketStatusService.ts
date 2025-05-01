
// Ticket status management utilities

export type DatabaseStatus = 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled' | 'canceled';
export type SimplifiedStatus = 'PENDING' | 'READY' | 'DELIVERED' | 'CANCELLED';

// Map database status to simplified UI status
export const mapToSimplifiedStatus = (status: DatabaseStatus): SimplifiedStatus => {
  switch (status) {
    case 'pending':
    case 'processing':
      return 'PENDING';
    case 'ready':
      return 'READY'; // Changed from PENDING to READY to distinguish this status
    case 'delivered':
      return 'DELIVERED';
    case 'cancelled':
    case 'canceled':
      return 'CANCELLED';
    default:
      return 'PENDING'; // Default to pending for unknown status
  }
};

// Map simplified status back to database status, preserving pending status detail if needed
export const mapToDatabaseStatus = (
  simplified: SimplifiedStatus, 
  currentStatus?: DatabaseStatus
): DatabaseStatus => {
  switch (simplified) {
    case 'PENDING':
      // If the current status is already a "pending" type status, preserve it
      if (currentStatus === 'pending' || currentStatus === 'processing') {
        return currentStatus;
      }
      return 'ready'; // Default pending status is 'ready'
    case 'DELIVERED':
      return 'delivered';
    case 'CANCELLED':
      return 'canceled';
    default:
      return 'ready';
  }
};

// Function to move a ticket to the next status in the workflow
export const moveToNextStatus = (ticket: { id: string, status: string }): { id: string, status: string } => {
  const currentStatus = ticket.status as DatabaseStatus;
  
  switch (currentStatus) {
    case 'pending':
      return { ...ticket, status: 'processing' };
    case 'processing':
      return { ...ticket, status: 'ready' };
    case 'ready':
      return { ...ticket, status: 'delivered' };
    default:
      return ticket; // No change for delivered or canceled
  }
};

// Helper function to check if a status is considered "delivered"
export const isDelivered = (status: string): boolean => {
  return status === 'delivered';
};

// Helper function to check if a status is considered "pending" (including processing and ready)
export const isPending = (status: string): boolean => {
  return ['pending', 'processing', 'ready'].includes(status);
};

// Check if a ticket is in a specific status
export const isInStatus = (status: string, checkStatus: string | string[]): boolean => {
  if (Array.isArray(checkStatus)) {
    return checkStatus.includes(status);
  }
  return status === checkStatus;
};

// Get all possible database statuses
export const getDatabaseStatuses = (): string[] => {
  return ['pending', 'processing', 'ready', 'delivered', 'cancelled', 'canceled'];
};

// Get a display name for a status
export const getStatusDisplayName = (status: string): string => {
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
    case 'canceled':
      return 'Cancelado';
    default:
      return 'Desconocido';
  }
};

// Get a CSS class for styling a status badge
export const getStatusBadgeClass = (status: string): string => {
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
    case 'canceled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
