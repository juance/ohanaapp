
import React from 'react';
import { ClientVisit } from '@/lib/types/customer.types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ClientListItem from '@/components/clients/ClientListItem';

interface ClientTableProps {
  filteredClients: ClientVisit[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: keyof ClientVisit;
  sortDirection: 'asc' | 'desc';
  handleSortChange: (field: keyof ClientVisit) => void;
  isEditingClient: string;
  editClientName: string;
  editClientPhone: string;
  selectedClient: ClientVisit | null;
  setEditClientName: (name: string) => void;
  setEditClientPhone: (phone: string) => void;
  handleSaveClient: (id: string) => void;
  handleCancelEdit: () => void;
  handleEditClient: (client: ClientVisit) => void;
  handleSelectClient: (client: ClientVisit) => void;
  onRefresh: () => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  filteredClients,
  searchQuery,
  setSearchQuery,
  sortField,
  sortDirection,
  handleSortChange,
  isEditingClient,
  editClientName,
  editClientPhone,
  selectedClient,
  setEditClientName,
  setEditClientPhone,
  handleSaveClient,
  handleCancelEdit,
  handleEditClient,
  handleSelectClient,
  onRefresh
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-4">
          <Input
            type="text"
            placeholder="Buscar cliente por nombre o teléfono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Button onClick={onRefresh}>Actualizar</Button>
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
    </div>
  );
};

export default ClientTable;
