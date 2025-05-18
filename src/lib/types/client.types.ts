
export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  freeValets: number;
  lastVisit?: string;
  totalSpent?: number;
  valetsCount?: number;
  loyaltyPoints?: number;
  visitFrequency?: string;
  lastVisitDate?: string;
}

// Add any helper types or functions related to clients
export interface Customer {
  id: string;
  name?: string;
  phone: string;
  lastVisit?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  valets_redeemed?: number;
}

// Utility function to convert Customer to ClientVisit
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name || 'Sin nombre',
    phoneNumber: customer.phone,
    visitCount: customer.valetsCount || 0,
    freeValets: customer.freeValets || 0,
    lastVisit: customer.lastVisit,
    loyaltyPoints: customer.loyaltyPoints || 0
  };
};
