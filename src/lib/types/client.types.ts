
export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  freeValets: number;
  lastVisit?: string;
  totalSpent?: number;
  valetsCount?: number;
}
