
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export const useAddClient = (refreshClients: () => Promise<void>) => {
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const handleAddClient = async () => {
    if (!newClientName || !newClientPhone) {
      toast.error('Nombre y teléfono son requeridos');
      return;
    }

    setIsAddingClient(true);
    try {
      // Insert client to database
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: newClientName,
          phone: newClientPhone
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh clients data
      await refreshClients();
      
      // Reset form
      setNewClientName('');
      setNewClientPhone('');
      toast.success('Cliente agregado correctamente');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error al agregar el cliente');
    } finally {
      setIsAddingClient(false);
    }
  };

  return {
    newClientName,
    setNewClientName,
    newClientPhone,
    setNewClientPhone,
    isAddingClient,
    handleAddClient
  };
};
