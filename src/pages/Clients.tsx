
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClientsList } from '@/hooks/useClientsList';
import ClientHeader from '@/components/clients/ClientHeader';
import ClientTable from '@/components/clients/ClientTable';
import ClientFormSection from '@/components/clients/ClientFormSection';
import { useClientFiltering } from '@/hooks/useClientFiltering';
import { useClientEditing } from '@/hooks/useClientEditing';
import { useAddClient } from '@/hooks/useAddClient';

const Clients = () => {
  // Load clients data
  const { clients: allClients, isLoading, refreshClients } = useClientsList();
  
  // Client filtering and sorting
  const { 
    filteredClients, 
    searchQuery, 
    setSearchQuery, 
    sortField, 
    sortDirection, 
    handleSortChange 
  } = useClientFiltering(allClients);
  
  // Client editing logic
  const {
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
  } = useClientEditing(refreshClients);
  
  // Add client logic
  const {
    newClientName,
    setNewClientName,
    newClientPhone,
    setNewClientPhone,
    isAddingClient,
    handleAddClient
  } = useAddClient(refreshClients);

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
      
      <ClientFormSection 
        newClientName={newClientName}
        newClientPhone={newClientPhone}
        isAddingClient={isAddingClient}
        setNewClientName={setNewClientName}
        setNewClientPhone={setNewClientPhone}
        handleAddClient={handleAddClient}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientTable 
            filteredClients={filteredClients}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSortChange={handleSortChange}
            isEditingClient={isEditingClient}
            editClientName={editClientName}
            editClientPhone={editClientPhone}
            selectedClient={selectedClient}
            setEditClientName={setEditClientName}
            setEditClientPhone={setEditClientPhone}
            handleSaveClient={handleSaveClient}
            handleCancelEdit={handleCancelEdit}
            handleEditClient={handleEditClient}
            handleSelectClient={handleSelectClient}
            onRefresh={refreshClients}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
