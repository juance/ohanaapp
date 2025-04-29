import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { getClientVisitFrequency } from '@/lib/data/clientService';
import { ClientVisit, Customer } from '@/lib/types/customer.types';

export const useClientData = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  // Load client data
  const loadClientData = async () => {
    setIsLoading(true);
    try {
      const visitData = await getClientVisitFrequency();
      
      // Make sure all required properties are present
      const formattedData: ClientVisit[] = visitData.map(client => ({
        ...client,
        lastVisitDate: client.lastVisit, // Ensure lastVisitDate is set
      }));
      
      setClients(formattedData);
    } catch (error) {
      console.error('Error loading client data:', error);
      toast.error('Error al cargar datos de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadClientData();
  }, []);

  // Handle client selection
  const handleSelectClient = (client: ClientVisit) => {
    setSelectedClient(client);
  };

  // Handle edit mode
  const handleEditClient = (client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  };

  // Handle save edit
  const handleSaveClient = async (id: string) => {
    try {
      // Find the client to update
      const clientToUpdate = clients.find(client => client.id === id);
      
      if (!clientToUpdate) {
        toast.error('Cliente no encontrado');
        return;
      }
      
      // Update the client
      const updatedClients = clients.map(client => {
        if (client.id === id) {
          return {
            ...client,
            clientName: editClientName,
            phoneNumber: editClientPhone
          };
        }
        return client;
      });
      
      // Update state
      setClients(updatedClients);
      
      // Update local storage
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      
      toast.success('Cliente actualizado correctamente');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar el cliente');
    }
    
    // Refresh client data
    loadClientData();
    // Reset edit state
    setIsEditingClient(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingClient(null);
  };

  // Handle adding a new client
  const handleAddClient = async () => {
    if (!newClientName.trim() || !newClientPhone.trim()) {
      toast.error('Por favor, complete todos los campos');
      return;
    }

    setIsAddingClient(true);

    try {
      // Create a new client object
      const newClient: ClientVisit = {
        id: `local-${Date.now()}`,
        clientName: newClientName,
        phoneNumber: newClientPhone,
        visitCount: 0,
        lastVisit: new Date().toISOString(),
        valetsCount: 0,
        freeValets: 0,
        loyaltyPoints: 0,
        visitFrequency: 'Ocasional',
        lastVisitDate: new Date().toISOString()
      };

      // Update state
      setClients([...clients, newClient]);

      // Update local storage
      const updatedClients = [...clients, newClient];
      localStorage.setItem('clients', JSON.stringify(updatedClients));

      toast.success('Cliente agregado correctamente');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Error al agregar el cliente');
    }
    
    // Refresh client data
    loadClientData();
    // Reset form
    setNewClientName('');
    setNewClientPhone('');
    setIsAddingClient(false);
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
    isAddingClient,
    setNewClientName,
    setNewClientPhone,
    setIsAddingClient,
    handleSelectClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    handleAddClient,
    setEditClientName,
    setEditClientPhone,
    refreshClients: loadClientData
  };
};
