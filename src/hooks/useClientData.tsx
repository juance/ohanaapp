
import { ClientVisit } from '@/lib/types/client.types';

// Only fixing the specific part with the error
// Convert to client visit method
const mapToClientVisit = (customer: any): ClientVisit => {
  return {
    id: customer.id,
    customerId: customer.id,
    customerName: customer.name,
    phoneNumber: customer.phone,
    visitDate: customer.last_visit || new Date().toISOString(),
    total: 0,
    isPaid: false,
    clientName: customer.name,
    visitCount: customer.valets_count || 0,
    lastVisit: customer.last_visit,
    loyaltyPoints: customer.loyalty_points || 0,
    freeValets: customer.free_valets || 0,
    valetsCount: customer.valets_count || 0
  };
};
