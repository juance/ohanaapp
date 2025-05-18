
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
  freeValets?: number; // Added to match usage in components
  valetsCount?: number; // Added to match usage in components
  valets_redeemed?: number;
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
  // Backward compatibility fields
  clientName?: string;
  visitCount?: number;
  freeValets?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  visitFrequency?: string;
  lastVisit?: string;
  lastVisitDate?: string;
  valetsCount?: number;
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
    clientName: customer.name,
    visitCount: customer.visitCount || 0,
    freeValets: customer.freeValets || 0,
    loyaltyPoints: customer.loyaltyPoints || 0,
    valetsCount: customer.valetsCount || 0
  };
};
