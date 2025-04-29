
export interface CustomerFeedback {
  id: string;
  customerId?: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}
