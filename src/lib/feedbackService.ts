
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { CustomerFeedback } from './types';

// Instead of calling an RPC function that doesn't exist, we'll handle the feedback
// functionality directly with standard Supabase queries
export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }
    
    // Transform the data to match our application structure
    return (data || []).map((item: any) => ({
      id: item.id,
      customerId: item.customer_id,
      customerName: item.customer_name,
      comment: item.comment,
      rating: item.rating,
      createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES') : ''
    }));
  } catch (error) {
    console.error('Error in getFeedback:', error);
    return [];
  }
};

export const addFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .insert({
        customer_id: feedback.customerId,
        customer_name: feedback.customerName,
        comment: feedback.comment,
        rating: feedback.rating
      });
    
    if (error) {
      console.error('Error adding feedback:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addFeedback:', error);
    return false;
  }
};

export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting feedback:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    return false;
  }
};
