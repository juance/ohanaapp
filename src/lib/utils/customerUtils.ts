
import { Customer } from '../types';
import { ClientVisit } from '../types/client.types';

export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  const lastVisitDate = customer.last_visit || customer.lastVisit || new Date().toISOString();
  return {
    id: customer.id,
    customerId: customer.id,
    customerName: customer.name || 'Sin nombre',
    clientName: customer.name || 'Sin nombre',
    phoneNumber: customer.phone || customer.phone_number || '',
    visitDate: lastVisitDate,
    total: 0,
    isPaid: false,
    visitCount: customer.valets_count || customer.valetsCount || 0,
    lastVisit: lastVisitDate,
    lastVisitDate: lastVisitDate,
    loyaltyPoints: customer.loyalty_points || customer.loyaltyPoints || 0,
    freeValets: customer.free_valets || customer.freeValets || 0,
    valetsCount: customer.valets_count || customer.valetsCount || 0,
    visitFrequency: calculateFrequency(lastVisitDate)
  };
};

// Helper function to calculate visit frequency
const calculateFrequency = (lastVisit: string | null): string => {
  if (!lastVisit) return 'N/A';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  return 'Ocasional';
};
