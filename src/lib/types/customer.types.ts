
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  lastVisit?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  createdAt?: string;
  visitCount?: number;
  visitFrequency?: string;
}

export interface ClientVisit {
  id: string;
  phoneNumber: string;
  clientName: string;
  visitCount: number;
  lastVisitDate: string;
  lastVisit?: string; // For backwards compatibility
  valetsCount?: number;
  freeValets?: number;
  loyaltyPoints?: number;
  visitFrequency: string;
}
