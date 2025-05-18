
import { ClientVisit } from '@/lib/types';

// Only fixing the specific part with the error
// Convert to client visit method
const mapToClientVisit = (customer: any): ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phone,
    visitCount: customer.valets_count || 0,
    lastVisit: customer.last_visit,
    loyaltyPoints: customer.loyalty_points || 0,
    freeValets: customer.free_valets || 0,
    valetsCount: customer.valets_count || 0
  };
};
