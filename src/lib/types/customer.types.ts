
// Re-export from client.types.ts for backward compatibility
export { ClientVisit, Customer, convertCustomerToClientVisit } from './client.types';

// Additional customer-specific types
export interface CustomerStats {
  visitCount: number;
  lastVisit: string | null;
  averageSpend: number;
  totalSpent: number;
}

export interface CustomerPreference {
  id: string;
  customerId: string;
  name: string;
  value: string;
}
