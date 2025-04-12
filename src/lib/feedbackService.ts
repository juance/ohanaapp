
import { supabase } from '@/integrations/supabase/client';
import { CustomerFeedback } from './types';

export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    // First try to get feedback from Supabase
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform to our internal format
    return data.map(item => ({
      id: item.id,
      customerName: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching feedback from Supabase:', error);
    
    // Fallback to local storage if Supabase is unavailable
    const localFeedback = localStorage.getItem('feedback');
    if (localFeedback) {
      try {
        return JSON.parse(localFeedback);
      } catch (parseError) {
        console.error('Error parsing local feedback:', parseError);
      }
    }
    
    return [];
  }
};

export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    // First try to delete from Supabase
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Also delete from local storage if exists
    const localFeedback = localStorage.getItem('feedback');
    if (localFeedback) {
      try {
        const feedbackItems: CustomerFeedback[] = JSON.parse(localFeedback);
        const updatedFeedback = feedbackItems.filter(item => item.id !== id);
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
      } catch (parseError) {
        console.error('Error updating local feedback:', parseError);
      }
    }

    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return false;
  }
};

export const addFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'createdAt'>): Promise<CustomerFeedback | null> => {
  try {
    const newFeedback: CustomerFeedback = {
      id: `feedback-${Date.now()}`,
      ...feedback,
      createdAt: new Date().toISOString(),
      pendingSync: true
    };
    
    // First try to add to Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        customer_name: newFeedback.customerName,
        rating: newFeedback.rating,
        comment: newFeedback.comment
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // If successful, use the Supabase ID and don't mark as pendingSync
    newFeedback.id = data.id;
    newFeedback.pendingSync = false;
    
    // Also save to local storage
    const localFeedback = localStorage.getItem('feedback');
    const feedbackItems: CustomerFeedback[] = localFeedback ? JSON.parse(localFeedback) : [];
    feedbackItems.push(newFeedback);
    localStorage.setItem('feedback', JSON.stringify(feedbackItems));
    
    return newFeedback;
  } catch (error) {
    console.error('Error adding feedback:', error);
    
    // If Supabase fails, still save to local storage for later sync
    try {
      const newFeedback: CustomerFeedback = {
        id: `feedback-${Date.now()}`,
        ...feedback,
        createdAt: new Date().toISOString(),
        pendingSync: true
      };
      
      const localFeedback = localStorage.getItem('feedback');
      const feedbackItems: CustomerFeedback[] = localFeedback ? JSON.parse(localFeedback) : [];
      feedbackItems.push(newFeedback);
      localStorage.setItem('feedback', JSON.stringify(feedbackItems));
      
      return newFeedback;
    } catch (localError) {
      console.error('Error saving feedback locally:', localError);
      return null;
    }
  }
};
