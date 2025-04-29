
import { useState, useEffect, useCallback } from 'react';
import { ClientVisit } from '@/lib/types';
import { useCachedClients } from './useCachedClients';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { convertCustomerToClientVisit } from '@/lib/types/customer.types';

export const useClientsList = () => {
  // Get clients from the cached clients hook
  const { clients, isLoading, error, refreshClients } = useCachedClients();

  // State for client management
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  const [isEditingClient, setIsEditingClient] = useState<string>('');
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Function to handle client selection
  const handleSelectClient = useCallback((client: ClientVisit) => {
    setSelectedClient(client);
  }, []);

  // Function to start editing a client
  const handleEditClient = useCallback((client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  }, []);

  // Function to cancel editing
  const handleCancelEdit = useCallback(() => {
    setIsEditingClient('');
    setEditClientName('');
    setEditClientPhone('');
  }, []);

  // Function to save edited client
  const handleSaveClient = useCallback(async () => {
    if (!isEditingClient) return;

    try {
      // Update client in Supabase
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: editClientPhone
        })
        .eq('id', isEditingClient);

      if (error) throw error;

      // Refresh client list
      await refreshClients();
      toast.success('Cliente actualizado exitosamente');
      setIsEditingClient('');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Error al actualizar el cliente');
    }
  }, [isEditingClient, editClientName, editClientPhone, refreshClients]);

  // Function to add a new client
  const handleAddClient = useCallback(async () => {
    if (!newClientName || !newClientPhone) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    setIsAddingClient(true);

    try {
      // Add client to Supabase
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: newClientName,
          phone: newClientPhone,
          valets_count: 0,
          free_valets: 0,
          loyalty_points: 0
        })
        .select();

      if (error) throw error;

      // Refresh client list
      await refreshClients();
      toast.success('Cliente agregado exitosamente');
      
      // Clear form
      setNewClientName('');
      setNewClientPhone('');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error al agregar el cliente');
    } finally {
      setIsAddingClient(false);
    }
  }, [newClientName, newClientPhone, refreshClients]);

  // Map to expose the necessary properties and functions that match what's used in pages/Clients.tsx
  return {
    clients,
    frequentClients: clients,
    isLoading,
    loading: isLoading,
    error: error || '',
    selectedClient: selectedClient || {} as ClientVisit,
    isEditingClient,
    editClientName,
    editClientPhone,
    newClientName,
    newClientPhone,
    isAddingClient,
    handleSelectClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    handleAddClient,
    setNewClientName,
    setNewClientPhone,
    setEditClientName,
    setEditClientPhone,
    refreshData: refreshClients
  };
};
