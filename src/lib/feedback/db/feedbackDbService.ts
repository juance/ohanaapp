
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback, FeedbackSource } from '@/lib/types';

export const getFeedbackFromDb = async (): Promise<CustomerFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      source: item.source as FeedbackSource || 'admin',
      createdAt: item.created_at,
      pendingSync: false
    }));
  } catch (error) {
    console.error('Error retrieving feedback from Supabase:', error);
    return [];
  }
};

export const createFeedbackInDb = async (feedback: CustomerFeedback): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .insert({
        id: feedback.id,
        customer_name: feedback.customerName,
        rating: feedback.rating,
        comment: feedback.comment,
        source: feedback.source,
        created_at: feedback.createdAt
      });

    return !error;
  } catch (error) {
    console.error('Error creating feedback in Supabase:', error);
    return false;
  }
};

export const deleteFeedbackFromDb = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Error deleting feedback from Supabase:', error);
    return false;
  }
};
