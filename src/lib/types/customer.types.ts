
export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  phone: string; // Alias for phoneNumber for database compatibility
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  valetsRedeemed?: number;
  lastVisit?: string;
  createdAt?: string;
}

export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  lastVisitDate: string; // Required field
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  visitFrequency: string;
}

export function convertCustomerToClientVisit(customer: Customer): ClientVisit {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phoneNumber || customer.phone,
    visitCount: customer.valetsCount,
    lastVisit: customer.lastVisit || '',
    lastVisitDate: customer.lastVisit || '',
    loyaltyPoints: customer.loyaltyPoints,
    freeValets: customer.freeValets,
    valetsCount: customer.valetsCount,
    visitFrequency: calculateFrequency(customer.lastVisit || '')
  };
}

function calculateFrequency(lastVisit: string): string {
  if (!lastVisit) return 'N/A';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  return 'Ocasional';
}
