
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientVisit } from '@/lib/types';
import ClientListItem from './ClientListItem';

interface ClientListProps {
  clients: ClientVisit[];
  isEditingClient: string | null;
  editClientName: string;
  editClientPhone: string;
  selectedClient: ClientVisit | null;
  onEditClient: (client: ClientVisit) => void;
  onSaveClient: (id: string) => void;
  onCancelEdit: () => void;
  onSelectClient: (client: ClientVisit) => void;
  onEditNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientList: React.FC<ClientListProps> = ({
  clients,
  isEditingClient,
  editClientName,
  editClientPhone,
  selectedClient,
  onEditClient,
  onSaveClient,
  onCancelEdit,
  onSelectClient,
  onEditNameChange,
  onEditPhoneChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Frecuentes</CardTitle>
        <CardDescription>Clientes con más visitas a la lavandería</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientListItem
                key={client.id}
                client={client}
                isEditing={isEditingClient === client.id}
                editClientName={editClientName}
                editClientPhone={editClientPhone}
                selectedClient={selectedClient}
                onEdit={() => onEditClient(client)}
                onSave={() => onSaveClient(client.id)}
                onCancel={onCancelEdit}
                onSelect={() => onSelectClient(client)}
                onEditNameChange={onEditNameChange}
                onEditPhoneChange={onEditPhoneChange}
              />
            ))
          ) : (
            <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
              No hay datos de clientes frecuentes disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;
