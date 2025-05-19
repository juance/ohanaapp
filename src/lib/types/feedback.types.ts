
export type FeedbackSource = 'admin' | 'web' | 'app' | 'external';

export interface CustomerFeedback {
  id?: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  source?: FeedbackSource;
  created_at?: string;
}
