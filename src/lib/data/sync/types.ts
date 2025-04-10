
export interface LocalClient {
  id: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  lastVisit?: string;
  pendingSync?: boolean;
}
