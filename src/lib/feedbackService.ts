
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from './types';

// Check if the customer_feedback table exists, if not, create it
const ensureFeedbackTableExists = async () => {
  try {
    // Call the RPC function to create the table if it doesn't exist
    const { error } = await supabase.rpc('create_feedback_table_if_not_exists');
    if (error) {
      console.error('Error ensuring feedback table exists:', error);
    }
  } catch (error) {
    console.error('Error in ensureFeedbackTableExists:', error);
  }
};

// Initialize the table check
ensureFeedbackTableExists();

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
      createdAt: new Date(item.created_at).toLocaleDateString('es-ES')
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
