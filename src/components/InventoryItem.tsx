
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem as InventoryItemType } from '@/lib/types';
import { toast } from 'sonner';
import { Package, Trash, Plus, Minus, Save, X, Edit } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InventoryItemProps {
  item: InventoryItemType;
  onDelete: (id: string) => void;
  onUpdate: (item: InventoryItemType) => void;
}

const InventoryItem = ({ item, onDelete, onUpdate }: InventoryItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setEditedItem({ ...item });
    setIsEditing(false);
  };
  
  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = Math.max(0, editedItem.quantity + amount);
    setEditedItem({ ...editedItem, quantity: newQuantity });
  };
  
  const getStockStatus = () => {
    const ratio = item.quantity / item.threshold;
    if (ratio <= 0.25) return 'Critical';
    if (ratio <= 0.5) return 'Low';
    if (ratio < 1) return 'Warning';
    return 'Normal';
  };
  
  const getProgressColor = () => {
    const status = getStockStatus();
    switch (status) {
      case 'Critical':
        return 'bg-red-500';
      case 'Low':
        return 'bg-orange-500';
      case 'Warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };
  
  const getProgressPercentage = () => {
    const percentage = (item.quantity / (item.threshold * 2)) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-laundry-100 text-laundry-500">
                <Package className="h-5 w-5" />
              </div>
              <Input
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                className="h-9"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Quantity</label>
                <div className="flex h-9 items-center rounded-md border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 rounded-r-none"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={editedItem.quantity}
                    onChange={(e) => setEditedItem({ ...editedItem, quantity: parseInt(e.target.value) || 0 })}
                    className="h-9 border-0 text-center"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 rounded-l-none"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Threshold</label>
                <Input
                  type="number"
                  value={editedItem.threshold}
                  onChange={(e) => setEditedItem({ ...editedItem, threshold: parseInt(e.target.value) || 0 })}
                  className="h-9"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Unit</label>
                <Input
                  value={editedItem.unit}
                  onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-8"
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 bg-laundry-500 hover:bg-laundry-600"
              >
                <Save className="mr-1 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-laundry-100 text-laundry-500">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.quantity} {item.unit}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    toast.success('Item deleted', {
                      description: `${item.name} has been removed from inventory`,
                    });
                    onDelete(item.id);
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Stock Level</span>
                <span
                  className={cn(
                    "font-medium",
                    getStockStatus() === 'Critical' && "text-red-500",
                    getStockStatus() === 'Low' && "text-orange-500",
                    getStockStatus() === 'Warning' && "text-yellow-500",
                    getStockStatus() === 'Normal' && "text-green-500"
                  )}
                >
                  {getStockStatus()}
                </span>
              </div>
              <Progress 
                value={getProgressPercentage()} 
                className="h-2"
                indicatorClassName={getProgressColor()}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>Threshold: {item.threshold}</span>
                <span>{item.threshold * 2}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryItem;
