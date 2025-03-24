
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';
import { ClientVisit } from '@/lib/types';

interface ClientListItemProps {
  client: ClientVisit;
  isEditing: boolean;
  editClientName: string;
  editClientPhone: string;
  selectedClient: ClientVisit | null;
  onEdit: (client: ClientVisit) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onSelect: (client: ClientVisit) => void;
  onEditNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({
  client,
  isEditing,
  editClientName,
  editClientPhone,
  selectedClient,
  onEdit,
  onSave,
  onCancel,
  onSelect,
  onEditNameChange,
  onEditPhoneChange
}) => {
  return (
    <div
      key={client.id || client.phoneNumber}
      className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
        selectedClient?.id === client.id ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => onSelect(client)}
    >
      {isEditing ? (
        <>
          <div className="space-y-1 flex-1 mr-2">
            <Input 
              value={editClientName} 
              onChange={onEditNameChange}
              className="mb-2"
            />
            <Input 
              value={editClientPhone} 
              onChange={onEditPhoneChange}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onSave(client.id);
              }}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1">
            <h3 className="font-medium">{client.clientName}</h3>
            <div className="text-sm text-muted-foreground">{client.phoneNumber}</div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {client.visitCount} visitas
            </span>
            <span className="text-xs text-muted-foreground">
              Última visita: {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'N/A'}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(client);
              }}
            >
              <Edit className="h-3 w-3 mr-1" />
              <span className="text-xs">Editar</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientListItem;
