
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from './types';

// Check if the customer_feedback table exists, if not, create it
const ensureFeedbackTableExists = async () => {
  const { error } = await supabase.rpc('check_feedback_table_exists');
  
  if (error) {
    console.error('Error checking for feedback table:', error);
    // Table might not exist, we'll create it via RPC
    const { error: createError } = await supabase.rpc('create_feedback_table');
    if (createError) {
      console.error('Error creating feedback table:', createError);
    }
  }
};

// Initialize the table check
ensureFeedbackTableExists();

export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // Using RPC to get feedback safely
    const { data, error } = await supabase.rpc('get_feedback');
    
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
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error in getFeedback:', error);
    return [];
  }
};

export const addFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    // Using RPC to add feedback safely
    const { data, error } = await supabase.rpc('add_feedback', {
      p_customer_id: feedback.customerId,
      p_customer_name: feedback.customerName,
      p_comment: feedback.comment,
      p_rating: feedback.rating
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
    // Using RPC to delete feedback safely
    const { error } = await supabase.rpc('delete_feedback', {
      p_feedback_id: id
    });
    
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
