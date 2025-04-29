
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  phone?: string; // Alias for backwards compatibility
  lastVisit?: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  valetsRedeemed?: number;
  createdAt?: string;
  visitCount?: number;
  visitFrequency?: string;
}

export interface ClientVisit {
  id: string;
  phoneNumber: string;
  clientName: string;
  visitCount: number;
  lastVisitDate: string; // Required for compatibility
  lastVisit: string; // For compatibility with existing code
  valetsCount: number;
  freeValets: number;
  loyaltyPoints: number;
  visitFrequency: string;
}
