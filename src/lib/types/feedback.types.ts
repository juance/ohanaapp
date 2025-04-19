
// Define the possible sources for customer feedback
export type FeedbackSource = 'admin' | 'client_portal' | string;

export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  source: FeedbackSource;
  createdAt: string;
  pendingSync?: boolean;
}
