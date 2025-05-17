
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { InventoryItemWithTimestamp } from '@/lib/types/inventory-ui.types';
import InventoryItem from '@/components/inventory/InventoryItem';

interface InventoryTableProps {
  items: InventoryItemWithTimestamp[];
  onEdit: (item: InventoryItemWithTimestamp) => void;
  onDelete: (item: InventoryItemWithTimestamp) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead className="text-right">Umbral</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No hay elementos de inventario. Crea uno nuevo.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
