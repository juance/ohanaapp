
// If this file already exists, we need to add/update the CustomerFeedback type
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
}

// Define any additional types needed (this will be merged with existing types)
export interface LaundryOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  selected?: boolean;
}

export interface Ticket {
  id: string;
  ticketNumber?: string;
  clientName: string;
  phoneNumber: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  pendingSync?: boolean;
  basketTicketNumber?: string;
  services?: Array<{
    id: string;
    name: string;
    price: number;
    quantity?: number;
  }>;
  paymentMethod?: PaymentMethod;
  status?: string;
  updatedAt?: string;
  deliveredDate?: string;
}

// Define PaymentMethod type if it's used in the app
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni';

// Añadir tipos adicionales que faltan según los errores
export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ticketId?: string;
}

export interface ClientVisit {
  id: string;
  clientId: string;
  date: string;
  amount: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  threshold?: number;
  notes?: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type Role = 'admin' | 'user';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

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
