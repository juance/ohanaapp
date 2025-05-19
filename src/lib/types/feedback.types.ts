
export type FeedbackSource = 'admin' | 'web' | 'app' | 'external' | 'client_portal';

export interface CustomerFeedback {
  id: string;
  customer_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  source?: FeedbackSource;
  created_at: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

// Helper functions to convert between snake_case and camelCase
export const toCamelCase = (feedback: CustomerFeedback): any => ({
  id: feedback.id,
  customerId: feedback.customer_id,
  customerName: feedback.customer_name,
  rating: feedback.rating,
  comment: feedback.comment,
  source: feedback.source,
  createdAt: feedback.created_at,
  pendingSync: feedback.pendingSync,
  pendingDelete: feedback.pendingDelete
});

export const toSnakeCase = (feedback: any): CustomerFeedback => ({
  id: feedback.id,
  customer_id: feedback.customerId,
  customer_name: feedback.customerName,
  rating: feedback.rating,
  comment: feedback.comment,
  source: feedback.source,
  created_at: feedback.createdAt,
  pendingSync: feedback.pendingSync,
  pendingDelete: feedback.pendingDelete
});
