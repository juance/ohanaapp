
import { CustomerFeedback } from '@/lib/types';

export const calculateAverageRating = (feedback: CustomerFeedback[]): number => {
  if (feedback.length === 0) return 0;
  const sum = feedback.reduce((total, item) => total + item.rating, 0);
  return sum / feedback.length;
};

export const filterFeedbackByRating = (
  feedback: CustomerFeedback[],
  rating: number
): CustomerFeedback[] => {
  return feedback.filter(item => item.rating === rating);
};

export const findFeedbackById = (
  feedback: CustomerFeedback[],
  id: string
): CustomerFeedback | null => {
  return feedback.find(item => item.id === id) || null;
};
