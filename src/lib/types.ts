
export interface Customer {
  id: string;
  name: string;
  phone: string;
  phoneNumber?: string; // Added for compatibility with components using phoneNumber
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  createdAt: string;
  updatedAt: string;
  lastVisit?: string;
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
  pendingSync?: boolean;
  pendingDelete?: boolean;
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
  createdAt?: string; 
  pendingSync?: boolean;
  synced?: boolean;
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

export interface LaundryService {
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
  dryCleaningItems?: Array<DryCleaningItem>;
  laundryOptions?: Array<LaundryOption>;
  pendingSync?: boolean;
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
  totalSales: number;
  valetCount: number;
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
  totalSales: number;
  valetCount: number;
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
  salesByDay: Record<string, number>;
  dryCleaningItems: Record<string, number>;
  totalSales: number;
  valetCount: number;
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
  lastSync?: string;
  pending?: boolean;
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

// System Error type for error logging
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context: Record<string, any>;
  resolved: boolean;
  component?: string;
}
