
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ClientVisit } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

export interface ClientListItemProps {
  client: ClientVisit;
  isEditing: boolean;
  editName: string;
  setEditName: (name: string) => void;
  editPhone: string;
  setEditPhone: (phone: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

const ClientListItem: React.FC<ClientListItemProps> = ({
  client,
  isEditing,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  onSave,
  onCancel,
  onEdit
}) => {
  const formatLastVisit = (dateStr?: string) => {
    if (!dateStr) return 'Nunca';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  if (isEditing) {
    return (
      <tr className="border-b bg-blue-50">
        <td className="py-2 px-3">
          <Input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3">
          <Input
            type="text"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3">
          {client.visitCount}
        </td>
        <td className="py-2 px-3">
          {formatLastVisit(client.lastVisit)}
        </td>
        <td className="text-right py-2 px-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={onSave}
          >
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2 px-3">{client.clientName}</td>
      <td className="py-2 px-3">{client.phoneNumber}</td>
      <td className="py-2 px-3">{client.visitCount}</td>
      <td className="py-2 px-3">{formatLastVisit(client.lastVisit)}</td>
      <td className="text-right py-2 px-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default ClientListItem;
