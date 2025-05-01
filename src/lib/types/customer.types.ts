
// Customer types

export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string;  // Alternative name for phone
  valetCount?: number;
  valetsCount?: number;
  freeValets: number;
  loyaltyPoints: number;
  lastVisit: string | null;
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
}

// Client visit data model, used in UI components
export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount?: number;
  lastVisitDate?: string | null;
  visitFrequency?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  pendingSync?: boolean;
}

// LocalClient - interface for clients stored locally
export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  lastVisit?: string;
  visitCount?: number;
  loyaltyPoints?: number;
  freeValets?: number;
  pendingSync?: boolean;
}

// Helper function to convert a Customer to a ClientVisit
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phone || customer.phoneNumber || '',
    lastVisitDate: customer.lastVisit,
    visitCount: customer.valetsCount || customer.valetCount || 0,
    loyaltyPoints: customer.loyaltyPoints || 0,
    freeValets: customer.freeValets || 0
  };
};
