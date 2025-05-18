
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  loyaltyPoints?: number;
  visitCount?: number;
  freeValets?: number;
  lastVisit?: string;
}

export interface CustomerData {
  name: string;
  phoneNumber: string;
  email?: string;
}
