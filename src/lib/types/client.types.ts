
import { Customer } from './customer.types';

// Interfaz específica para la visualización de clientes en la interfaz
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
}

// Función para convertir un Customer a ClientVisit
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    customerId: customer.id,
    customerName: customer.name,
    phoneNumber: customer.phone || customer.phone_number,
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
