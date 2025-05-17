
import React from 'react';
import AddClientForm from '@/components/clients/AddClientForm';

interface ClientFormSectionProps {
  newClientName: string;
  newClientPhone: string;
  isAddingClient: boolean;
  setNewClientName: (name: string) => void;
  setNewClientPhone: (phone: string) => void;
  handleAddClient: () => void;
}

const ClientFormSection: React.FC<ClientFormSectionProps> = ({
  newClientName,
  newClientPhone,
  isAddingClient,
  setNewClientName,
  setNewClientPhone,
  handleAddClient
}) => {
  return (
    <AddClientForm
      newClientName={newClientName}
      newClientPhone={newClientPhone}
      isAddingClient={isAddingClient}
      onNameChange={(e) => setNewClientName(e.target.value)}
      onPhoneChange={(e) => setNewClientPhone(e.target.value)}
      onAddClient={handleAddClient}
    />
  );
};

export default ClientFormSection;
