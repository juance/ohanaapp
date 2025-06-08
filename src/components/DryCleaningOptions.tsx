
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';

export interface SelectedDryCleaningItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface DryCleaningOption {
  id: string;
  name: string;
  price: number;
}

export const dryCleaningItems: DryCleaningOption[] = [
  { id: 'shirt', name: 'Camisa', price: 2500 },
  { id: 'pants', name: 'Pantalón', price: 3000 },
  { id: 'dress', name: 'Vestido', price: 4000 },
  { id: 'suit', name: 'Traje', price: 8000 },
  { id: 'coat', name: 'Abrigo', price: 5000 },
  { id: 'skirt', name: 'Falda', price: 2800 },
  { id: 'blouse', name: 'Blusa', price: 2500 },
  { id: 'jacket', name: 'Chaqueta', price: 4500 },
  { id: 'tie', name: 'Corbata', price: 1500 },
  { id: 'sweater', name: 'Suéter', price: 3500 }
];

interface DryCleaningOptionsProps {
  selectedItems: SelectedDryCleaningItem[];
  onItemsChange: (items: SelectedDryCleaningItem[]) => void;
}

const DryCleaningOptions: React.FC<DryCleaningOptionsProps> = ({
  selectedItems,
  onItemsChange
}) => {
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      const updatedItems = selectedItems.filter(item => item.id !== itemId);
      onItemsChange(updatedItems);
      return;
    }

    const dryCleaningItem = dryCleaningItems.find(item => item.id === itemId);
    if (!dryCleaningItem) return;

    const existingItemIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        price: dryCleaningItem.price // Ensure price is from the base item
      };
      onItemsChange(updatedItems);
    } else {
      // Add new item
      const newItem: SelectedDryCleaningItem = {
        id: itemId,
        name: dryCleaningItem.name,
        quantity: newQuantity,
        price: dryCleaningItem.price
      };
      onItemsChange([...selectedItems, newItem]);
    }
  };

  const getItemQuantity = (itemId: string): number => {
    const item = selectedItems.find(item => item.id === itemId);
    return item?.quantity || 0;
  };

  const calculateTotal = (): number => {
    return selectedItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios de Tintorería</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {dryCleaningItems.map((item) => {
            const quantity = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-colors ${
                  quantity > 0 ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-blue-600 font-semibold">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, Math.max(0, quantity - 1))}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <Input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 0;
                        handleQuantityChange(item.id, newQuantity);
                      }}
                      className="w-16 text-center h-8"
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {quantity > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        ${(item.price * quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Resumen de Servicios</h4>
                <p className="text-sm text-gray-600">
                  {selectedItems.length} servicio{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${calculateTotal().toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DryCleaningOptions;
