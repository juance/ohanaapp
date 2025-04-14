
export type Role = 'admin' | 'operator' | 'client';

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
  requiresPasswordChange?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Customer related types
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  createdAt?: string;
  lastVisit?: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
  valetsRedeemed?: number;
}

export interface ClientVisit {
  id: string;
  clientId?: string;
  phoneNumber: string;
  clientName: string;
  visitCount: number;
  lastVisit?: string;
  valetsCount?: number;
  freeValets?: number;
  loyaltyPoints?: number;
}

// Ticket related types
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

export interface Ticket {
  id?: string;
  ticketNumber: string;
  basketTicketNumber?: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered';
  deliveredDate?: string;
  isPaid?: boolean;
  valetQuantity?: number;
  services: Array<{
    name: string;
    price?: number;
    quantity?: number;
  }>;
  isPaidInAdvance?: boolean;
  usesFreeValet?: boolean;
}

export interface DryCleaningItem {
  id?: string;
  ticketId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface LaundryOption {
  id: string;
  name: string;
  price?: number;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  isSelected?: boolean;
}

// Inventory related types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  lastUpdated?: string;
  pendingSync?: boolean;
}

// Feedback related types
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

// Sync related types
export interface SyncStatus {
  lastSync: string;
  pending: {
    tickets: number;
    clients: number;
    feedback: number;
    inventory: number;
    expenses: number;
  }
}

export interface LocalClient {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  lastVisit?: string;
  pendingSync: boolean;
}

// Metrics related types
export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems: Record<string, number>;
  totalSales: number;
  valetCount: number;
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  totalSales: number;
  valetCount: number;
}

// Expense related types
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  pendingSync?: boolean;
}
