
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import { ClientVisit } from '@/lib/types';
import ClientListItem from '@/components/clients/ClientListItem';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import AddClientForm from '@/components/clients/AddClientForm';
import { convertCustomerToClientVisit } from '@/lib/types/customer.types';
import { useClientsList } from '@/hooks/useClientsList';
import ClientHeader from '@/components/clients/ClientHeader';

const Clients = () => {
  const { clients: allClients, isLoading, refreshClients } = useClientsList();
  const [filteredClients, setFilteredClients] = useState<ClientVisit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof ClientVisit>('clientName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isEditingClient, setIsEditingClient] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  // Update filtered clients when all clients or search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(allClients);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = allClients.filter(client => {
      return (
        client.clientName.toLowerCase().includes(lowercaseQuery) ||
        client.phoneNumber.toLowerCase().includes(lowercaseQuery)
      );
    });

    setFilteredClients(filtered);
  }, [searchQuery, allClients]);

  // Sort clients when sort field or direction changes
  useEffect(() => {
    const sorted = [...filteredClients].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });

    setFilteredClients(sorted);
  }, [sortField, sortDirection, filteredClients]);

  const handleSortChange = (field: keyof ClientVisit) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ClientHeader />
      
      <AddClientForm
        newClientName={newClientName}
        newClientPhone={newClientPhone}
        isAddingClient={isAddingClient}
        onNameChange={(e) => setNewClientName(e.target.value)}
        onPhoneChange={(e) => setNewClientPhone(e.target.value)}
        onAddClient={handleAddClient}
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Clientes</CardTitle>
            <Button onClick={refreshClients}>Actualizar</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Buscar cliente por nombre o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th 
                    className="text-left py-2 px-3 cursor-pointer"
                    onClick={() => handleSortChange('clientName')}
                  >
                    Nombre {sortField === 'clientName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left py-2 px-3 cursor-pointer"
                    onClick={() => handleSortChange('phoneNumber')}
                  >
                    Teléfono {sortField === 'phoneNumber' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left py-2 px-3 cursor-pointer"
                    onClick={() => handleSortChange('visitCount')}
                  >
                    Visitas {sortField === 'visitCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="text-left py-2 px-3 cursor-pointer"
                    onClick={() => handleSortChange('lastVisit')}
                  >
                    Última Visita {sortField === 'lastVisit' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-right py-2 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <ClientListItem
                    key={client.id}
                    client={client}
                    isEditing={isEditingClient === client.id}
                    editName={editClientName}
                    setEditName={setEditClientName}
                    editPhone={editClientPhone}
                    setEditPhone={setEditClientPhone}
                    selectedClient={selectedClient}
                    onSave={() => handleSaveClient(client.id)}
                    onCancel={handleCancelEdit}
                    onEdit={() => handleEditClient(client)}
                    onSelect={() => handleSelectClient(client)}
                  />
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No se encontraron clientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
