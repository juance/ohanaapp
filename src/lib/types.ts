
export type Role = 'admin' | 'cashier' | 'operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type PaymentMethod = 'cash' | 'debit' | 'mercado_pago' | 'cuenta_dni';

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  services: LaundryService[];
  paymentMethod: PaymentMethod;
  totalPrice: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  createdAt: string;
  updatedAt: string;
}

export interface Metrics {
  daily: {
    income: number;
    expenses: number;
  };
  weekly: {
    income: number;
    expenses: number;
  };
  monthly: {
    income: number;
    expenses: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
}

export interface ClientVisit {
  phoneNumber: string;
  clientName: string;
  visitCount: number;
  lastVisit: string;
}
