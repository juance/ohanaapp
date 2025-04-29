
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';
import type { InventoryItem as InventoryItemType } from '@/lib/types';
import { Pencil, Trash2, Save } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdate: (id: string, data: Partial<InventoryItemType>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit || 'unidad');
  const [threshold, setThreshold] = useState((item.threshold || 5).toString());
  const [notes, setNotes] = useState(item.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the item is low on stock
  const isLowStock = item.quantity < (item.threshold || 5);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      
      const updatedData = {
        name,
        quantity: parseInt(quantity, 10),
        unit,
        threshold: parseInt(threshold, 10),
        notes
      };
      
      await onUpdate(item.id, updatedData);
      
      toast.success('Inventario actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      toast.error('Error al actualizar el inventario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await onDelete(item.id);
      toast.success('Artículo eliminado correctamente');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Error al eliminar el artículo');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              placeholder="Nombre del artículo"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Cantidad</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
                min="0"
              />
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-1/3"
                placeholder="Unidad"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Umbral mínimo</label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full"
              min="0"
              placeholder="Cantidad mínima"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Notas</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full"
              placeholder="Notas adicionales"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={`bg-white rounded-lg shadow p-4 mb-4 ${isLowStock ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">{item.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>
              {item.quantity}
            </span>
            <span className="text-sm text-gray-600 ml-1">{item.unit || 'unidades'}</span>
            {isLowStock && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded ml-2">
                Stock bajo
              </span>
            )}
          </div>
          {item.threshold && (
            <p className="text-xs text-gray-500 mt-1">
              Mínimo recomendado: {item.threshold} {item.unit || 'unidades'}
            </p>
          )}
          {item.notes && <p className="text-sm text-gray-600 mt-2">{item.notes}</p>}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Eliminarás "{item.name}" del inventario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
