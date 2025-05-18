
export interface SyncStats {
  added: number;
  updated: number;
  failed: number;
}

export interface SyncResult {
  tickets: SyncStats;
  clients: SyncStats;
  inventory: SyncStats;
  feedback: SyncStats;
}

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  valets_count: number;
  free_valets: number;
  loyalty_points: number;
}

export interface SyncableCustomerFeedback {
  id?: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  source?: string;
  created_at?: string;
}
