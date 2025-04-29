
export * from './ticket.types';
export * from './sync.types';
export * from './metrics.types';

export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisitDate: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  description?: string;
  icon?: string;
}
