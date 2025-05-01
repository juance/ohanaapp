
// Customer types

export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber: string;
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  lastVisit?: string;
  valetsRedeemed: number;
  createdAt: string;
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisitDate?: string;
  lastVisit?: string;
  loyaltyPoints: number;
  freeValets: number;
  visitFrequency?: string;
}

export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phone,
    visitCount: customer.valetsCount || 0,
    lastVisitDate: customer.lastVisit,
    lastVisit: customer.lastVisit,
    loyaltyPoints: customer.loyaltyPoints || 0,
    freeValets: customer.freeValets || 0
  };
};
