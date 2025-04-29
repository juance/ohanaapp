
export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetCount?: number;
  valetsCount?: number; // Campo alternativo 
  valetsRedeemed?: number; // Agregando este campo
  lastVisit?: string;
  createdAt?: string;
  updatedAt?: string; // Agregando este campo
  
  // Campos para compatibilidad con ClientVisit
  clientName?: string;
  phoneNumber?: string;
  visitCount?: number;
}

export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  valetsRedeemed?: number;
  
  // Campos para compatibilidad con Customer
  name?: string;
  phone?: string;
}

export type CustomerUpdate = Partial<Omit<Customer, 'id'>>;
