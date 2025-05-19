
// Client visit type
export interface ClientVisit {
  id: string;
  clientId?: string;
  customerId?: string;
  clientName?: string;
  customerName?: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  lastVisitDate: string;
  visitDate?: string; // For compatibility
  valetsCount: number;
  freeValets: number;
  loyaltyPoints: number;
  visitFrequency: string;
  total?: number; // For compatibility
  isPaid?: boolean; // For compatibility
}

export interface ClientVisitStats {
  totalVisits: number;
  frequentClients: number;
  newClients: number;
}
