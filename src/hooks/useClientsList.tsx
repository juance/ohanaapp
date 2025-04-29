
import { useState, useEffect } from 'react';
import { ClientVisit } from '@/lib/types';
import { getClientVisitFrequency } from '@/lib/dataService';
import { toast } from '@/lib/toast';

export const useClientsList = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  const [isEditingClient, setIsEditingClient] = useState<string>('');
  const [editClientName, setEditClientName] = useState<string>('');
  const [editClientPhone, setEditClientPhone] = useState<string>('');
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [showAddClientForm, setShowAddClientForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // Load client data
  const loadClientData = async () => {
    setIsLoading(true);
    try {
      const data = await getClientVisitFrequency();
      setClients(data);
    } catch (err) {
      console.error('Error loading client data:', err);
      setError('Error al cargar datos de clientes');
      toast.error('Error al cargar datos de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when the component mounts
  useEffect(() => {
    loadClientData();
  }, []);

  // Refresh clients data
  const refreshClients = async () => {
    await loadClientData();
  };

  return {
    clients,
    isLoading,
    selectedClient,
    isEditingClient,
    editClientName,
    editClientPhone,
    newClientName,
    newClientPhone,
    showAddClientForm,
    showDeleteConfirm,
    clientToDelete,
    setSelectedClient,
    setIsEditingClient,
    setEditClientName,
    setEditClientPhone,
    setNewClientName,
    setNewClientPhone,
    setShowAddClientForm,
    setShowDeleteConfirm,
    setClientToDelete,
    refreshClients,
    error
  };
};
