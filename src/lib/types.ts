
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

// Updated Customer interface
export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string; // Added for backward compatibility
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  createdAt?: string;
  lastVisit?: string;
}

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ticketId?: string;
}

// Updated ClientVisit interface
export interface ClientVisit {
  id: string;
  clientId?: string;
  date?: string;
  amount?: number;
  // Adding fields that were being used in the codebase
  phoneNumber?: string;
  clientName?: string;
  visitCount?: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
  visitFrequency?: string;
}

// Updated InventoryItem with lastUpdated field
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  threshold?: number;
  notes?: string;
  lastUpdated?: string;
}

// Updated User interface with role field
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: Role;
}

export type Role = 'admin' | 'user' | 'cashier' | 'operator';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  createdAt?: string;
}

// Updated metrics interfaces to include the fields used in the codebase
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
  valetsByDay?: Record<string, number>; // Added field being used in code
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems?: Record<string, number>; // Added field being used in code
  totalSales: number;
  valetCount: number;
}

export interface MonthlyMetrics {
  salesByDay: Record<string, number>;
  salesByWeek?: Record<string, number>; // Added field being used in code
  paymentMethods: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
  dryCleaningItems?: Record<string, number>; // Added field being used in code
  totalSales: number;
  valetCount: number;
}

// Define LocalClient interface for sync operations
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
