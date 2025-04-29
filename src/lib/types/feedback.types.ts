
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  source?: FeedbackSource;
}

export type FeedbackSource = 'app' | 'web' | 'store' | 'phone' | string;

export interface FeedbackAnalytics {
  averageRating: number;
  totalFeedback: number;
  ratingsDistribution: {
    [key: number]: number;
  };
  recentComments: CustomerFeedback[];
}
