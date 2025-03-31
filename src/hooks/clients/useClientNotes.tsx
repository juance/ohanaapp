
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Hook for managing client notes
 */
export const useClientNotes = () => {
  const [clientNotes, setClientNotes] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  
  const loadClientNotes = useCallback(async (clientId: string) => {
    setIsLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('notes')
        .eq('id', clientId)
        .single();
        
      if (error) throw error;
      
      setClientNotes(data?.notes || '');
    } catch (err) {
      console.error("Error loading client notes:", err);
      setClientNotes('');
      toast.error("No se pudieron cargar las notas del cliente");
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  const saveClientNotes = async (notes: string, selectedClient: ClientVisit | null) => {
    if (!selectedClient) {
      toast.error("No hay cliente seleccionado");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ notes })
        .eq('id', selectedClient.id);
        
      if (error) throw error;
      
      setClientNotes(notes);
      toast.success("Notas guardadas correctamente");
    } catch (err) {
      console.error("Error saving client notes:", err);
      toast.error("Error al guardar las notas del cliente");
      throw err;
    }
  };

  return {
    clientNotes,
    isLoadingNotes,
    loadClientNotes,
    saveClientNotes
  };
};
