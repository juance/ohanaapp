
export interface CustomerFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  pendingSync?: boolean;
  pendingDelete?: boolean;
}

export const FEEDBACK_STORAGE_KEY = 'customerFeedback';
