
export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string; // Added for compatibility with components using phoneNumber
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  createdAt: string;
  updatedAt?: string;
  lastVisit?: string;
  valetsRedeemed?: number;
}

export interface ClientVisit {
  id: string;
  clientId?: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
  visitFrequency?: string;
}
