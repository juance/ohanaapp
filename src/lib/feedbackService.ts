
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CustomerFeedback } from './types';

// Get all customer feedback
export const getAllFeedback = async (): Promise<CustomerFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .select(`
        *,
        customers (name)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map((item: any) => ({
      id: item.id,
      customerId: item.customer_id,
      customerName: item.customers?.name || 'Cliente Anónimo',
      comment: item.comment,
      rating: item.rating,
      createdAt: new Date(item.created_at).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    toast.error('Error al cargar los comentarios de clientes');
    return [];
  }
};

// Add new customer feedback
export const addFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'customerName' | 'createdAt'>): Promise<CustomerFeedback | null> => {
  try {
    const { data, error } = await supabase
      .from('customer_feedback')
      .insert({
        customer_id: feedback.customerId,
        comment: feedback.comment,
        rating: feedback.rating
      })
      .select(`
        *,
        customers (name)
      `)
      .single();
      
    if (error) throw error;
    
    toast.success('Comentario agregado con éxito');
    
    return {
      id: data.id,
      customerId: data.customer_id,
      customerName: data.customers?.name || 'Cliente Anónimo',
      comment: data.comment,
      rating: data.rating,
      createdAt: new Date(data.created_at).toLocaleDateString()
    };
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    toast.error('Error al agregar comentario');
    return null;
  }
};

// Delete customer feedback
export const deleteFeedback = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customer_feedback')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Comentario eliminado con éxito');
    return true;
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    toast.error('Error al eliminar comentario');
    return false;
  }
};
