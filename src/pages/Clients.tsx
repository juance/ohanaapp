
import React from 'react';
import Navbar from '@/components/Navbar';
import { Loading } from '@/components/ui/loading';
import ClientHeader from '@/components/clients/ClientHeader';
import ClientList from '@/components/clients/ClientList';
import AddClientForm from '@/components/clients/AddClientForm';
import LoyaltyProgram from '@/components/clients/LoyaltyProgram';
import { useClientsList } from '@/hooks/useClientsList';
import { useLoyaltyProgram } from '@/hooks/useLoyaltyProgram';
import { Customer, ClientVisit } from '@/lib/types';

const Clients = () => {
  const { 
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
  } = useClientsList();

  const {
    selectedClient,
    pointsToAdd,
    setPointsToAdd,
    pointsToRedeem,
    setPointsToRedeem,
    isAddingPoints,
    handleSelectClient,
    handleAddPoints,
    handleRedeemPoints
  } = useLoyaltyProgram(refreshData);

  // Helper function to convert Customer type to ClientVisit type
  const convertToClientVisit = (client: Customer): ClientVisit => {
    return {
      id: client.id,
      clientName: client.name,
      phoneNumber: client.phone,
      visitCount: client.valetsCount || client.valetCount || 0,
      lastVisit: client.lastVisit,
      loyaltyPoints: client.loyaltyPoints,
      freeValets: client.freeValets
    };
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto max-w-6xl pt-6">
          <ClientHeader />

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-lg font-medium text-red-800">Error al cargar clientes</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <ClientList 
                clients={frequentClients}
                isEditingClient={isEditingClient}
                editClientName={editClientName}
                editClientPhone={editClientPhone}
                selectedClient={selectedClient as ClientVisit}
                onEditClient={(client) => handleEditClient(client as any)}
                onSaveClient={handleSaveClient}
                onCancelEdit={handleCancelEdit}
                onSelectClient={handleSelectClient as any}
                onEditNameChange={(e) => setEditClientName(e.target.value)}
                onEditPhoneChange={(e) => setEditClientPhone(e.target.value)}
              />

              <AddClientForm 
                newClientName={newClientName}
                newClientPhone={newClientPhone}
                isAddingClient={isAddingClient}
                onNameChange={(e) => setNewClientName(e.target.value)}
                onPhoneChange={(e) => setNewClientPhone(e.target.value)}
                onAddClient={handleAddClient}
              />

              <LoyaltyProgram 
                selectedClient={selectedClient as any}
                pointsToAdd={pointsToAdd}
                pointsToRedeem={pointsToRedeem}
                isAddingPoints={isAddingPoints}
                onPointsToAddChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                onPointsToRedeemChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                onAddPoints={handleAddPoints}
                onRedeemPoints={handleRedeemPoints}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
