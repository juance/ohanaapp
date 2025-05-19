
import { Customer } from './customer.types';

// Interface for ClientVisit with all required fields
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
  clientId?: string;
}

// Function to convert a Customer to ClientVisit
export function convertCustomerToClientVisit(customer: Customer): ClientVisit {
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
}
