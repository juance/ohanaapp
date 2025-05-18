
import { Customer, ClientVisit } from '../types/client.types';

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
