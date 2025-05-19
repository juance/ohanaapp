
import { Customer } from '../types';
import { ClientVisit } from '../types';

export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    customerId: customer.id,
    customerName: customer.name,
    clientName: customer.name || 'Sin nombre',
    phoneNumber: customer.phone || customer.phone_number,
    visitDate: customer.last_visit || customer.lastVisit || new Date().toISOString(),
    total: 0,
    isPaid: false,
    visitCount: customer.valets_count || customer.valetsCount || 0,
    lastVisit: customer.last_visit || customer.lastVisit,
    loyaltyPoints: customer.loyalty_points || customer.loyaltyPoints || 0,
    freeValets: customer.free_valets || customer.freeValets || 0,
    valetsCount: customer.valets_count || customer.valetsCount || 0
  };
};
