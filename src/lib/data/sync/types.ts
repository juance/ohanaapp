
import { CustomerFeedback } from '@/lib/types';

// Metrics interfaces
export interface DailyMetrics {
  salesByHour: Record<string, number>;
  paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
  dryCleaningItems: Record<string, number>;
  totalSales?: number;
  valetCount?: number;
}

export interface WeeklyMetrics {
  salesByDay: Record<string, number>;
  valetsByDay: Record<string, number>;
  paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
  dryCleaningItems: Record<string, number>;
}

export interface MonthlyMetrics {
  salesByWeek: Record<string, number>;
  valetsByWeek: Record<string, number>;
  paymentMethods: { cash: number; debit: number; mercadopago: number; cuentaDni: number };
  dryCleaningItems: Record<string, number>;
}

export interface LocalMetrics {
  daily?: DailyMetrics;
  weekly?: WeeklyMetrics;
  monthly?: MonthlyMetrics;
}

export interface LocalClient {
  id?: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  pendingSync?: boolean;
}

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}
