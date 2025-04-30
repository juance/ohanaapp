
// Add this file to define FeedbackSource type
export type FeedbackSource = 'admin' | 'web' | 'mobile' | 'kiosk';

export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: string;
  pendingSync?: boolean;
}
