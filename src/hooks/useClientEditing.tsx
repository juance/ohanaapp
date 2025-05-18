
import { useState } from 'react';
import { ClientVisit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export const useClientEditing = (refreshClients: () => Promise<void>) => {
  const [isEditingClient, setIsEditingClient] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);

  const handleEditClient = (client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
    setSelectedClient(client);
  };

  const handleSaveClient = async (clientId: string) => {
    try {
      // Update client in database
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: editClientPhone
        })
        .eq('id', clientId);

      if (error) throw error;

      // Refresh clients data after update
      await refreshClients();
      setIsEditingClient('');
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar el cliente');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingClient('');
  };

  const handleSelectClient = (client: ClientVisit) => {
    setSelectedClient(selectedClient?.id === client.id ? null : client);
  };

  return {
    isEditingClient,
    editClientName,
    editClientPhone,
    selectedClient,
    setEditClientName,
    setEditClientPhone,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    handleSelectClient
  };
};
