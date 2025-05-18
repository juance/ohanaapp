
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  phone_number?: string;  // For compatibility with different API formats
  email?: string;
  valets_count?: number;
  free_valets?: number;
  loyalty_points?: number;
  last_visit?: string;
  created_at?: string;
  updated_at?: string;
  notes?: string;
  valets_redeemed?: number;
  last_reset_date?: string;
  // Add these aliases for consistent property access
  valetsCount?: number;
  freeValets?: number;
  loyaltyPoints?: number;
  lastVisit?: string;
}

export interface CustomerWithStats extends Customer {
  visitFrequency?: string;
  lastVisitDate?: string;
  visitCount?: number;
}

// Add the ClientVisit interface that was missing proper export
export interface ClientVisit {
  id: string;
  customerId: string;
  customerName: string;
  phoneNumber?: string;
  visitDate: string;
  total: number;
  isPaid: boolean;
  clientName?: string;
  visitCount?: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  visitFrequency?: string;
  lastVisitDate?: string;
}

// Convert this to a normal function instead of a type
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    customerId: customer.id,
    customerName: customer.name,
    phoneNumber: customer.phone || customer.phone_number,
    visitDate: customer.last_visit || customer.lastVisit || new Date().toISOString(),
    total: 0,
    isPaid: false,
    clientName: customer.name,
    visitCount: customer.valets_count || customer.valetsCount || 0,
    lastVisit: customer.last_visit || customer.lastVisit,
    loyaltyPoints: customer.loyalty_points || customer.loyaltyPoints || 0,
    freeValets: customer.free_valets || customer.freeValets || 0,
    valetsCount: customer.valets_count || customer.valetsCount || 0
  };
};
