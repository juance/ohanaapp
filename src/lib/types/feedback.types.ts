
export interface CustomerFeedback {
  id: string;
  customerName: string;
  comment: string;
  rating: number;
  createdAt: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}
