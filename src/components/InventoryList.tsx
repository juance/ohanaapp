import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusIcon, SearchIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { InventoryItem } from '@/lib/types/inventory.types';
import { toast } from '@/lib/toast';

// We'll update the InventoryItem type to include the missing lastUpdated property
interface InventoryItemWithTimestamp extends InventoryItem {
  lastUpdated?: string;
}

// Component implementation
const InventoryList = () => {
  const [items, setItems] = useState<InventoryItemWithTimestamp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof InventoryItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItemWithTimestamp | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
    notes: ''
  });
  const [editItem, setEditItem] = useState<InventoryItemWithTimestamp>({
    id: '',
    name: '',
    quantity: 0,
    unit: '',
    threshold: 0,
    notes: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockInventory: InventoryItemWithTimestamp[] = [
      { id: '1', name: 'Camisetas', quantity: 50, unit: 'unidades', threshold: 20, notes: 'Algodón', lastUpdated: '2024-07-01' },
      { id: '2', name: 'Pantalones', quantity: 30, unit: 'unidades', threshold: 15, notes: 'Jean', lastUpdated: '2024-07-01' },
      { id: '3', name: 'Zapatos', quantity: 20, unit: 'pares', threshold: 10, notes: 'Cuero', lastUpdated: '2024-07-01' },
    ];
    setItems(mockInventory);
  }, []);

  const handleSort = (column: keyof InventoryItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedItems = React.useMemo(() => {
    if (!sortColumn) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortColumn] || '';
      const bValue = b[sortColumn] || '';

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [items, sortColumn, sortDirection]);

  const filteredItems = sortedItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateItem = async () => {
    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newItemWithId: InventoryItemWithTimestamp = { ...newItem, id: String(Date.now()), lastUpdated: new Date().toISOString() };
      setItems([...items, newItemWithId]);
      setNewItem({ name: '', quantity: 0, unit: '', threshold: 0, notes: '' });
      setOpenCreateDialog(false);
      toast.success('Ítem creado con éxito');
    } catch (error) {
      toast.error('Error al crear el ítem');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateItem = async () => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedItems = items.map(item => item.id === editItem.id ? { ...editItem, lastUpdated: new Date().toISOString() } : item);
      setItems(updatedItems);
      setOpenEditDialog(false);
      toast.success('Ítem actualizado con éxito');
    } catch (error) {
      toast.error('Error al actualizar el ítem');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteItem = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedItems = items.filter(item => item.id !== selectedItem?.id);
      setItems(updatedItems);
      setOpenDeleteDialog(false);
      toast.success('Ítem eliminado con éxito');
    } catch (error) {
      toast.error('Error al eliminar el ítem');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Inventario</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar..."
              className="pl-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" onClick={() => setOpenCreateDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Crear Ítem
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button variant="ghost" onClick={() => handleSort('name')}>
                    Nombre
                    {sortColumn === 'name' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px] text-right">
                  <Button variant="ghost" onClick={() => handleSort('quantity')}>
                    Cantidad
                    {sortColumn === 'quantity' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </Button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort('unit')}>
                    Unidad
                    {sortColumn === 'unit' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                  </Button>
                </TableHead>
                <TableHead className="w-[120px] text-right">
                  <Button variant="ghost" onClick={() => handleSort('threshold')}>
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
              {filteredItems.map((item) => (
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
                      onClick={() => {
                        setEditItem(item);
                        setOpenEditDialog(true);
                      }}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No se encontraron items.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Create Item Dialog */}
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Ítem</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                type="text"
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                type="number"
                id="quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unidad
              </Label>
              <Input
                type="text"
                id="unit"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Umbral
              </Label>
              <Input
                type="number"
                id="threshold"
                value={newItem.threshold}
                onChange={(e) =>
                  setNewItem({ ...newItem, threshold: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <Input
                type="text"
                id="notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenCreateDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleCreateItem} disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Ítem</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                type="text"
                id="name"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <Input
                type="number"
                id="quantity"
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unidad
              </Label>
              <Input
                type="text"
                id="unit"
                value={editItem.unit}
                onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="threshold" className="text-right">
                Umbral
              </Label>
              <Input
                type="number"
                id="threshold"
                value={editItem.threshold}
                onChange={(e) =>
                  setEditItem({ ...editItem, threshold: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <Input
                type="text"
                id="notes"
                value={editItem.notes}
                onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenEditDialog(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleUpdateItem} disabled={isUpdating}>
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el ítem de forma permanente. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} disabled={isDeleting}>
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default InventoryList;
