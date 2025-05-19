
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  phone_number?: string;  // Para compatibilidad con diferentes formatos de API
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
  // Añadir estos alias para un acceso coherente a las propiedades
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

// Definir correctamente ClientVisit como una interfaz
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

// Convertir esto a una función normal en lugar de un tipo
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
