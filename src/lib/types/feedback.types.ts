
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: 'client_portal' | 'admin';
  pendingSync?: boolean;
  pendingDelete?: boolean;
  synced?: boolean;
}
