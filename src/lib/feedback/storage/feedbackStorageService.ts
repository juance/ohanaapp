
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/data/coreUtils';
import { CustomerFeedback } from '@/lib/types';

const FEEDBACK_STORAGE_KEY = 'customer_feedback';

export const getFeedbackFromStorage = (): CustomerFeedback[] => {
  return getFromLocalStorage<CustomerFeedback>(FEEDBACK_STORAGE_KEY) || [];
};

export const saveFeedbackToStorage = (feedback: CustomerFeedback[]): void => {
  saveToLocalStorage(FEEDBACK_STORAGE_KEY, feedback);
};
