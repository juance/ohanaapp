
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
  synced?: boolean;
}
