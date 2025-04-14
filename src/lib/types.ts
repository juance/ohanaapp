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
