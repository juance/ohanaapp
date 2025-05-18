
// Customer interface for client information
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastVisit?: string;
  visitCount?: number;
  loyaltyPoints?: number;
  hasFreeValet?: boolean;
}

// Client visit interface for tracking customer interactions
export interface ClientVisit {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber?: string;
  visitDate: string;
  ticketId?: string;
  ticketNumber?: string;
  total: number;
  isPaid: boolean;
  pendingSync?: boolean;
}

// Helper function to convert from Customer to ClientVisit
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: `visit-${customer.id}`,
    customerId: customer.id,
    customerName: customer.name,
    phoneNumber: customer.phone,
    visitDate: customer.lastVisit || new Date().toISOString(),
    total: 0,
    isPaid: false,
  };
};
