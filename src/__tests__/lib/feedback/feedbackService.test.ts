
import { mockSupabaseClient } from '../../mocks/supabase';
import { getAllFeedback, addFeedback, deleteFeedback } from '@/lib/feedback/feedbackService';

// Mock del cliente Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

// Mock del localStorage
jest.mock('@/lib/feedback/storage/feedbackStorageService', () => ({
  getFeedbackFromStorage: jest.fn(() => []),
  saveFeedbackToStorage: jest.fn(),
}));

// Mock del servicio de DB
jest.mock('@/lib/feedback/db/feedbackDbService', () => ({
  getFeedbackFromDb: jest.fn(() => Promise.resolve([])),
  createFeedbackInDb: jest.fn(() => Promise.resolve(true)),
  deleteFeedbackFromDb: jest.fn(() => Promise.resolve(true)),
}));

describe('FeedbackService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFeedback', () => {
    test('should retrieve all feedback from database and storage', async () => {
      const result = await getAllFeedback();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('addFeedback', () => {
    test('should add new feedback', async () => {
      const feedbackData = {
        customer_name: 'Juan Pérez',
        rating: 5,
        comment: 'Excelente servicio',
        source: 'admin' as const,
      };

      const result = await addFeedback(feedbackData);
      expect(result).toBeDefined();
      expect(result.customer_name).toBe('Juan Pérez');
      expect(result.rating).toBe(5);
    });
  });

  describe('deleteFeedback', () => {
    test('should delete feedback by id', async () => {
      const result = await deleteFeedback('feedback-123');
      expect(result).toBe(true);
    });
  });
});
