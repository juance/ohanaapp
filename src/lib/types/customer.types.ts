
export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetCount?: number;
  valetsCount?: number; // Alternative field name
  lastVisit?: string;
  createdAt?: string;
  
  // Fields for compatibility with ClientVisit
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
  
  // Fields for compatibility with Customer
  name?: string;
  phone?: string;
}

export type CustomerUpdate = Partial<Omit<Customer, 'id'>>;
