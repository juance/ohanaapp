
export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: 'in_store' | 'client_portal' | string;
  pendingSync?: boolean;
}
