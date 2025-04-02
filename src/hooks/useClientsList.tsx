import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClientData } from './useClientData';
import { ClientVisit } from '@/lib/types';

export const useClientsList = () => {
  const { frequentClients, refreshData, loading, error } = useClientData();
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');

  const handleAddClient = async () => {
    if (!newClientName || !newClientPhone) {
      toast.error("Error", {
        description: "Nombre y teléfono son campos obligatorios.",
      });
      return;
    }
    
    setIsAddingClient(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert({
          name: newClientName,
          phone: newClientPhone,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0
        });
        
      if (error) throw error;
      
      toast.success("Cliente agregado", {
        description: "El cliente ha sido agregado exitosamente.",
      });
      
      await refreshData();
      
      setNewClientName('');
      setNewClientPhone('');
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast.error("Error", {
        description: err.message || "Hubo un error al agregar el cliente.",
      });
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleEditClient = (client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  };

  const handleSaveClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: editClientPhone
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Cliente actualizado", {
        description: "Los datos del cliente han sido actualizados.",
      });
      
      setIsEditingClient(null);
      await refreshData();
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "Error al actualizar el cliente.",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingClient(null);
  };

  return {
    frequentClients,
    loading,
    error,
    newClientName,
    setNewClientName,
    newClientPhone,
    setNewClientPhone,
    isAddingClient,
    isEditingClient,
    editClientName,
    setEditClientName,
    editClientPhone,
    setEditClientPhone,
    handleAddClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    refreshData
  };
};
