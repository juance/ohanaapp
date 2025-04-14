export interface Customer {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  valetsCount: number;
  freeValets: number;
  createdAt: string;
  updatedAt: string;
}

// Expense related types
export type ExpenseCategory = 'supplies' | 'utilities' | 'rent' | 'salaries' | 'other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

// Feedback related types
export interface Feedback {
  id: string;
  date: string;
  rating: number;
  comment?: string;
}

// Ticket related types
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'transfer';

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
  id: string;
  ticketNumber: string;
  clientName: string;
  phoneNumber: string;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  valetQuantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  basketTicketNumber?: string;
  deliveredAt?: string;
  isCanceled?: boolean;
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
