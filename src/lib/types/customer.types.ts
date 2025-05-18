
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  loyaltyPoints?: number;
  visitCount?: number;
  freeValets?: number;
  lastVisit?: string;
  valetsCount?: number; // Added this property that is referenced in components
  phone?: string; // For compatibility with database fields
}

export interface CustomerData {
  name: string;
  phoneNumber: string;
  email?: string;
}
