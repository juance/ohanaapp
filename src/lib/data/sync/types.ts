
// LocalClient type for clientsSync.ts
export interface LocalClient {
  id?: string;
  clientName: string;
  phoneNumber: string;
  loyaltyPoints?: number;
  freeValets?: number;
  valetsCount?: number;
  pendingSync: boolean;
}

// Definition for LocalMetrics used in metricsSync.ts
export interface LocalMetrics {
  daily: {
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
  };
  weekly: {
    salesByDay: Record<string, number>;
    paymentMethods: {
      cash: number;
      debit: number;
      mercadopago: number;
      cuentaDni: number;
    };
    totalSales: number;
    valetCount: number;
  };
  monthly: {
    salesByDay: Record<string, number>;
    paymentMethods: {
      cash: number;
      debit: number;
      mercadopago: number;
      cuentaDni: number;
    };
    totalSales: number;
    valetCount: number;
  };
}

// Sync status interface for syncStatusService.ts
export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}
