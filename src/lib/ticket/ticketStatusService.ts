
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
      return 'PENDING'; // Also treated as pending in the UI
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
