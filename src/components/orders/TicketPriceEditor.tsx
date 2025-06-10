
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Check, X } from 'lucide-react';
import { toast } from '@/lib/toast';

interface TicketPriceEditorProps {
  ticketId: string;
  currentPrice: number;
  onPriceUpdate: (ticketId: string, newPrice: number) => Promise<void>;
  isReadOnly?: boolean;
}

const TicketPriceEditor: React.FC<TicketPriceEditorProps> = ({
  ticketId,
  currentPrice,
  onPriceUpdate,
  isReadOnly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(currentPrice.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditPrice(currentPrice.toString());
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditPrice(currentPrice.toString());
  };

  const handleSavePrice = async () => {
    const newPrice = parseFloat(editPrice);
    
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Por favor ingresa un precio válido');
      return;
    }

    setIsUpdating(true);
    try {
      await onPriceUpdate(ticketId, newPrice);
      setIsEditing(false);
      toast.success('Precio actualizado correctamente');
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Error al actualizar el precio');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isReadOnly) {
    return (
      <div className="flex justify-between">
        <span className="text-sm">Total:</span>
        <span className="font-semibold">{formatCurrency(currentPrice)}</span>
      </div>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-3">
        <Label className="text-xs font-medium text-gray-600 mb-2 block">
          EDITAR PRECIO
        </Label>
        
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">Total:</span>
              <div className="font-semibold text-lg">{formatCurrency(currentPrice)}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="price-input" className="text-xs">
                Nuevo precio
              </Label>
              <Input
                id="price-input"
                type="number"
                min="0"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="h-8 text-sm"
                placeholder="0.00"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSavePrice}
                disabled={isUpdating}
                className="flex-1 h-8 text-xs"
              >
                {isUpdating ? (
                  <svg className="h-3 w-3 animate-spin mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Guardar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketPriceEditor;
