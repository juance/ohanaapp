
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
  updatedAt?: string;
}

export interface ClientVisit {
  id: string;
  phoneNumber: string;
  clientName: string;
  visitCount: number;
  lastVisitDate?: string; // Making this optional
  lastVisit: string; // For compatibility with existing code
  valetsCount: number;
  freeValets: number;
  loyaltyPoints: number;
  visitFrequency: string;
}

// Helper function to convert Customer to ClientVisit
export const convertCustomerToClientVisit = (customer: Customer): ClientVisit => {
  return {
    id: customer.id,
    phoneNumber: customer.phoneNumber || customer.phone || '',
    clientName: customer.name,
    visitCount: customer.visitCount || customer.valetsCount || 0,
    lastVisitDate: customer.lastVisit,
    lastVisit: customer.lastVisit || '',
    valetsCount: customer.valetsCount || 0,
    freeValets: customer.freeValets || 0,
    loyaltyPoints: customer.loyaltyPoints || 0,
    visitFrequency: customer.visitFrequency || calculateVisitFrequency(customer.lastVisit)
  };
};

// Helper function to calculate visit frequency
const calculateVisitFrequency = (lastVisit?: string): string => {
  if (!lastVisit) return 'N/A';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  return 'Ocasional';
};
