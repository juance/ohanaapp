
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InventoryItem as InventoryItemType } from '@/lib/types';
import { Edit, Trash, Check, X } from 'lucide-react';

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdate: (id: string, updatedItem: Partial<InventoryItemType>) => void;
  onDelete: (id: string) => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<InventoryItemType>(item);
  
  const handleSave = () => {
    onUpdate(item.id, editedItem);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };
  
  const getStatusColor = () => {
    if (item.quantity <= 0) return 'text-red-600';
    if (item.quantity <= (item.threshold || 5)) return 'text-amber-500';
    return 'text-green-600';
  };
  
  if (isEditing) {
    return (
      <tr className="border-b">
        <td className="py-2 px-3">
          <Input
            value={editedItem.name}
            onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3">
          <Input
            type="number"
            value={editedItem.quantity}
            onChange={(e) => setEditedItem({...editedItem, quantity: parseInt(e.target.value) || 0})}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3">
          <Input
            type="number"
            value={editedItem.threshold || 5}
            onChange={(e) => setEditedItem({...editedItem, threshold: parseInt(e.target.value) || 5})}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3">
          <Input
            value={editedItem.unit || 'unidad'}
            onChange={(e) => setEditedItem({...editedItem, unit: e.target.value})}
            className="w-full"
          />
        </td>
        <td className="py-2 px-3 text-right">
          <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 mr-1">
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    );
  }
  
  return (
    <tr className="border-b">
      <td className="py-2 px-3">{item.name}</td>
      <td className={`py-2 px-3 font-medium ${getStatusColor()}`}>{item.quantity}</td>
      <td className="py-2 px-3">{item.threshold || 5}</td>
      <td className="py-2 px-3">{item.unit || 'unidad'}</td>
      <td className="py-2 px-3 text-right">
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 mr-1">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)} className="h-8 w-8 text-red-500">
          <Trash className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default InventoryItem;
