
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

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}
