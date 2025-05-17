
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { InventoryItemProps } from '@/lib/types/inventory-ui.types';

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-right">{item.quantity}</TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell className="text-right">{item.threshold}</TableCell>
      <TableCell>{item.notes}</TableCell>
      <TableCell>{item.lastUpdated}</TableCell>
      <TableCell className="text-right">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => onEdit(item)}
          className="mr-2"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(item)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default InventoryItem;
