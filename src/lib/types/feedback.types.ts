
// Add this file to define FeedbackSource type
export type FeedbackSource = 'admin' | 'web' | 'mobile' | 'kiosk';

export interface CustomerFeedback {
  id: string;
  customerName: string;
  customerId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: FeedbackSource | string;
  pendingSync?: boolean;
}

// Add metrics interface for feedback analysis
export interface FeedbackMetrics {
  averageRating: number;
  totalCount: number;
  countBySource: Record<string, number>;
  ratingDistribution: Record<number, number>;
}
