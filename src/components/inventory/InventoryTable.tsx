
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import InventoryItem from './InventoryItem';
import { InventoryItemWithTimestamp } from '@/lib/types/inventory-ui.types';

interface InventoryTableProps {
  items: InventoryItemWithTimestamp[];
  sortColumn: keyof InventoryItemWithTimestamp | null;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof InventoryItemWithTimestamp) => void;
  onEdit: (item: InventoryItemWithTimestamp) => void;
  onDelete: (item: InventoryItemWithTimestamp) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  items, 
  sortColumn, 
  sortDirection, 
  onSort, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => onSort('name')}>
                Nombre
                {sortColumn === 'name' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-right">
              <Button variant="ghost" onClick={() => onSort('quantity')}>
                Cantidad
                {sortColumn === 'quantity' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => onSort('unit')}>
                Unidad
                {sortColumn === 'unit' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead className="w-[120px] text-right">
              <Button variant="ghost" onClick={() => onSort('threshold')}>
                Umbral
                {sortColumn === 'threshold' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </Button>
            </TableHead>
            <TableHead>Notas</TableHead>
            <TableHead className="w-[150px]">Última actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <InventoryItem 
                key={item.id} 
                item={item} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No se encontraron items.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
