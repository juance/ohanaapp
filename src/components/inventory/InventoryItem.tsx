
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { InventoryItemProps } from '@/lib/types/inventory-ui.types';
import { format } from 'date-fns';

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onEdit, onDelete }) => {
  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Get status based on quantity and threshold
  const getStatus = () => {
    if (item.quantity <= 0) return 'Sin stock';
    if (item.threshold && item.quantity <= item.threshold) return 'Bajo';
    return 'Normal';
  };

  // Get status color based on status
  const getStatusColor = () => {
    const status = getStatus();
    if (status === 'Sin stock') return 'text-red-500';
    if (status === 'Bajo') return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className={`text-right ${getStatusColor()}`}>
        {item.quantity}
      </TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell className="text-right">{item.threshold}</TableCell>
      <TableCell>{item.notes || '-'}</TableCell>
      <TableCell>{formatDate(item.lastUpdated)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-500" onClick={() => onDelete(item)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default InventoryItem;
