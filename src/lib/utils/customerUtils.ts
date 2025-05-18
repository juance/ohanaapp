
import { Customer } from '../types/customer.types';
import { ClientVisit } from '../types/client.types';

/**
 * Convert a Customer object to a ClientVisit object
 * @param customer Customer object from database
 * @returns ClientVisit object for UI
 */
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phoneNumber || customer.phone || '',
    visitCount: customer.visitCount || customer.valetsCount || 0,
    freeValets: customer.freeValets || 0,
    lastVisit: customer.lastVisit,
    valetsCount: customer.valetsCount || 0,
    loyaltyPoints: customer.loyaltyPoints || 0
  };
};
