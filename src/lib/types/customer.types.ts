
export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string; // Added for compatibility
  valetsCount: number;
  freeValets: number;
  loyaltyPoints: number;
  lastVisit: string;
  valetCount?: number; // Alias for backward compatibility
  valetsRedeemed?: number; // Added for compatibility
}

export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  loyaltyPoints: number;
  freeValets: number;
  lastVisitDate: string;
  valetsCount: number;
  visitFrequency: string;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  clientName?: string; // For backward compatibility
  phoneNumber?: string; // For backward compatibility
  valetsCount: number;
}

export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
}

// Convert Customer to ClientVisit format
export function convertCustomerToClientVisit(customer: Customer): ClientVisit {
  return {
    id: customer.id,
    clientName: customer.name,
    phoneNumber: customer.phoneNumber || customer.phone,
    visitCount: customer.valetsCount || 0,
    lastVisit: customer.lastVisit || '',
    loyaltyPoints: customer.loyaltyPoints || 0,
    freeValets: customer.freeValets || 0,
    lastVisitDate: customer.lastVisit || '',
    valetsCount: customer.valetsCount || 0,
    visitFrequency: getVisitFrequency(customer.lastVisit)
  };
}

// Helper function to determine visit frequency
function getVisitFrequency(lastVisit: string): string {
  if (!lastVisit) return 'Nuevo';
  
  const lastVisitDate = new Date(lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) return 'Semanal';
  if (diffDays <= 30) return 'Mensual';
  if (diffDays <= 90) return 'Trimestral';
  return 'Ocasional';
}
