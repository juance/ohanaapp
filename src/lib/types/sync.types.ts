
export interface SimpleSyncStatus {
  tickets: number;
  expenses: number;
  clients: number;
  feedback: number;
}

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
  pending?: boolean;
  lastSync?: string;
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

export interface SyncableExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  created_at?: string;
  pendingSync?: boolean;
}

export interface SyncableTicket {
  id: string;
  ticket_number: string;
  client_name: string;
  phone_number: string;
  status: string;
  created_at: string;
  delivered_date: string | null;
  total_price: number;
  payment_method?: string;
  valet_quantity?: number;
  is_paid?: boolean;
  pendingSync?: boolean;
}

export interface SyncableCustomerFeedback {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  source?: string;
  customer_id?: string;
  created_at: string;
  pendingSync?: boolean;
}
