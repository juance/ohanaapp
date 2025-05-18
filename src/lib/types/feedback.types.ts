
export interface CustomerFeedback {
  id: string;
  customerId?: string;
  customerName: string;
  rating: number;
  comment: string;
  source?: string;
  created_at?: string;
}
