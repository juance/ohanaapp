
export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string; // Added for compatibility with components using phoneNumber
  valetsRedeemed?: number; // Added for compatibility
}

// Client Visit type for frequent clients functionality
export interface ClientVisit {
  id: string;
  clientName: string;
  phoneNumber: string;
  visitCount: number;
  lastVisit: string;
  loyaltyPoints?: number;
  valetsCount?: number;
  freeValets?: number;
  visitFrequency?: string;
}

// Customer Feedback type
export interface CustomerFeedback {
  id: string;
  customerName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

// Inventory related types
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  threshold: number;
  unit: string;
  lastUpdated?: string;
}

// Expense related types
export type ExpenseCategory = 'supplies' | 'utilities' | 'rent' | 'salaries' | 'other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  createdAt?: string; // Added for compatibility
  pendingSync?: boolean; // Added for sync functionality
  synced?: boolean; // Added for sync functionality
}

// Feedback related types
export interface Feedback {
  id: string;
  date: string;
  rating: number;
  comment?: string;
}

// Ticket related types
export type PaymentMethod = 'cash' | 'debit' | 'mercadopago' | 'cuenta_dni' | 'credit_card' | 'debit_card' | 'transfer';

export interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  ticketId?: string;
}

export interface LaundryOption {
  id: string;
  name: string;
  price: number;
}

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
  isCanceled?: boolean;
  deliveredAt?: string;
}

export interface LaundryService {
  id: string;
  name: string;
  price: number;
  isSelected?: boolean;
  quantity?: number;
}

// Dashboard related types
export interface DashboardMetrics {
  totalRevenue: number;
  expenses: number;
  netRevenue: number;
  newCustomers: number;
  ticketsCreated: number;
  averageRating: number;
}

// Metrics related types
export interface DailyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByHour: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
}

export interface WeeklyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByDay: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
}

export interface MonthlyMetrics {
  totalTickets: number;
  paidTickets: number;
  totalRevenue: number;
  salesByWeek: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  paymentMethods?: {
    cash: number;
    debit: number;
    mercadopago: number;
    cuentaDni: number;
  };
}

// Settings related types
export interface AppSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
}

// Sync related types
export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}

// Local storage types
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

export interface LocalMetrics {
  daily: {
    salesByHour: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    dryCleaningItems: Record<string, number>;
    totalSales: number;
    valetCount: number;
  };
  weekly: {
    salesByDay: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    totalSales: number;
    valetCount: number;
  };
  monthly: {
    salesByDay: Record<string, number>;
    paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
    totalSales: number;
    valetCount: number;
  };
  pendingSync?: boolean;
}

// User and auth related types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export type Role = 'admin' | 'staff' | 'manager';
