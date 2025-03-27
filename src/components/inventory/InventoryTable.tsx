
import React from 'react';
import { InventoryItem } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Package, Pencil, Trash } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead>Stock Mínimo</TableHead>
          <TableHead>Última Actualización</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">
                  <Package className="h-4 w-4" />
                </span>
                {item.name}
              </div>
            </TableCell>
            <TableCell>
              <span className={item.quantity <= item.threshold ? "text-red-600 font-medium" : ""}>
                {item.quantity} {item.unit}
              </span>
            </TableCell>
            <TableCell>{item.threshold} {item.unit}</TableCell>
            <TableCell>{item.lastUpdated}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-600"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-600"
                  onClick={() => onDelete(item)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
