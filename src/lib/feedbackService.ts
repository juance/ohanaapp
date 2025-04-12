
import { CustomerFeedback } from './types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Get all feedback items
export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    let feedback: CustomerFeedback[] = [];
    
    // Try to get feedback from Supabase first
    const { data, error } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (data) {
      // Transform to our app format
      feedback = data.map((item: any) => ({
        id: item.id,
        customerName: item.customer_name,
        rating: item.rating,
        comment: item.comment,
        createdAt: item.created_at
      }));
    }
    
    // Also fetch local feedback
    const localFeedback = getLocalFeedback();
    
    // Combine both sources, avoiding duplicates
    for (const feedbackItem of localFeedback) {
      if (!feedback.some(fb => fb.id === feedbackItem.id)) {
        feedback.push(feedbackItem);
      }
    }
    
    return feedback;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    
    // Fall back to local storage if API fails
    return getLocalFeedback();
  }
};

// Get feedback from local storage
export const getLocalFeedback = (): CustomerFeedback[] => {
  try {
    const feedbackJson = localStorage.getItem('feedback');
    return feedbackJson ? JSON.parse(feedbackJson) : [];
  } catch (e) {
    console.error('Error parsing local feedback:', e);
    return [];
  }
};

// Save a new feedback item
export const saveFeedback = async (feedbackItem: CustomerFeedback): Promise<void> => {
  try {
    // Generate ID if not provided
    if (!feedbackItem.id) {
      feedbackItem.id = uuidv4();
    }
    
    // Set creation time if not provided
    if (!feedbackItem.createdAt) {
      feedbackItem.createdAt = new Date().toISOString();
    }
    
    // Mark as pending sync
    feedbackItem.pendingSync = true;
    
    // Save to local storage first
    const existingFeedback = getLocalFeedback();
    existingFeedback.push(feedbackItem);
    localStorage.setItem('feedback', JSON.stringify(existingFeedback));
    
    // Try to save to Supabase if available
    try {
      const { error } = await supabase
        .from('customer_feedback')
        .insert({
          id: feedbackItem.id,
          customer_name: feedbackItem.customerName,
          rating: feedbackItem.rating,
          comment: feedbackItem.comment,
          created_at: feedbackItem.createdAt
        });
      
      if (!error) {
        // If saved to Supabase, update local copy to not pending
        feedbackItem.pendingSync = false;
        const updatedFeedback = getLocalFeedback().map(item => 
          item.id === feedbackItem.id ? { ...item, pendingSync: false } : item
        );
        localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
      }
    } catch (err) {
      // Supabase save failed, but local save succeeded
      console.error('Error saving feedback to Supabase:', err);
    }
    
    toast({
      title: "¡Gracias por tu opinión!",
      description: "Tu comentario ha sido guardado correctamente."
    });
  } catch (e) {
    console.error('Error saving feedback:', e);
    toast({
      title: "Error",
      description: "No se pudo guardar tu opinión. Por favor, intenta nuevamente.",
      variant: "destructive"
    });
  }
};

// Delete a feedback item
export const deleteFeedback = async (id: string): Promise<void> => {
  try {
    // Remove from local storage
    const existingFeedback = getLocalFeedback();
    const updatedFeedback = existingFeedback.filter(item => item.id !== id);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    
    // Try to delete from Supabase if available
    try {
      await supabase
        .from('customer_feedback')
        .delete()
        .eq('id', id);
    } catch (err) {
      console.error('Error deleting feedback from Supabase:', err);
      // Continue anyway as we've deleted from local storage
    }
    
    toast({
      title: "Eliminado",
      description: "El comentario ha sido eliminado correctamente."
    });
  } catch (e) {
    console.error('Error deleting feedback:', e);
    toast({
      title: "Error",
      description: "No se pudo eliminar el comentario. Por favor, intenta nuevamente.",
      variant: "destructive"
    });
  }
};
