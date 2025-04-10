
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

export interface SyncStatus {
  ticketsSync: number;
  expensesSync: number;
  clientsSync: number;
  feedbackSync: number;
}

export interface LocalMetrics {
  id: string;
  data: any;
  date: string;
  pendingSync?: boolean;
}
