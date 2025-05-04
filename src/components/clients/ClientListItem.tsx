
import React from 'react';
import { ClientVisit } from '@/lib/types/customer.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

interface ClientListItemProps {
  client: ClientVisit;
  isEditing: boolean;
  editName?: string;
  setEditName?: (value: string) => void;
  editPhone?: string;
  setEditPhone?: (value: string) => void;
  selectedClient: ClientVisit | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onSelect: () => void;
  editClientName?: string; // For compatibility
  editClientPhone?: string; // For compatibility
  onEditNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditPhoneChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({
  client,
  isEditing,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  selectedClient,
  onEdit,
  onSave,
  onCancel,
  onSelect,
  editClientName,
  editClientPhone,
  onEditNameChange,
  onEditPhoneChange
}) => {
  // Use either edit props mechanism
  const currentEditName = editName || editClientName || '';
  const currentEditPhone = editPhone || editClientPhone || '';
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setEditName) {
      setEditName(e.target.value);
    } else if (onEditNameChange) {
      onEditNameChange(e);
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setEditPhone) {
      setEditPhone(e.target.value);
    } else if (onEditPhoneChange) {
      onEditPhoneChange(e);
    }
  };

  const isSelected = selectedClient && selectedClient.id === client.id;

  return (
    <tr className={isSelected ? 'bg-blue-50' : ''}>
      <td className="py-2 px-3">
        {isEditing ? (
          <Input
            type="text"
            value={currentEditName}
            onChange={handleNameChange}
            className="h-8"
          />
        ) : (
          client.clientName
        )}
      </td>
      <td className="py-2 px-3">
        {isEditing ? (
          <Input
            type="tel"
            value={currentEditPhone}
            onChange={handlePhoneChange}
            className="h-8"
          />
        ) : (
          client.phoneNumber
        )}
      </td>
      <td className="py-2 px-3">{client.visitCount || client.valetsCount}</td>
      <td className="py-2 px-3">
        {client.lastVisit ? formatDate(client.lastVisit) : 'N/A'}
      </td>
      <td className="py-2 px-3 text-right space-x-2">
        {isEditing ? (
          <>
            <Button size="sm" variant="outline" onClick={onSave}>Guardar</Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="ghost" onClick={onEdit}>Editar</Button>
            <Button size="sm" variant="outline" onClick={onSelect}>Seleccionar</Button>
          </>
        )}
      </td>
    </tr>
  );
};

export default ClientListItem;
