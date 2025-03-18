
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define dry cleaning items with their prices
export const dryCleaningItems = [
  { id: 'camisa', name: 'Camisa', price: 3000 },
  { id: 'pantalon', name: 'Pantalón', price: 3500 },
  { id: 'traje', name: 'Traje', price: 8000 },
  { id: 'vestido', name: 'Vestido', price: 6000 },
  { id: 'abrigo', name: 'Abrigo', price: 7000 },
  { id: 'saco', name: 'Saco', price: 5000 },
  { id: 'campera', name: 'Campera', price: 6000 },
  { id: 'mantel', name: 'Mantel', price: 4000 },
];

export interface SelectedDryCleaningItem {
  id: string;
  quantity: number;
}

interface DryCleaningOptionsProps {
  selectedItems: SelectedDryCleaningItem[];
  onItemsChange: (items: SelectedDryCleaningItem[]) => void;
}

const DryCleaningOptions: React.FC<DryCleaningOptionsProps> = ({ selectedItems, onItemsChange }) => {
  
  const handleItemToggle = (itemId: string) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    
    if (existingItem) {
      // Remove the item
      onItemsChange(selectedItems.filter(item => item.id !== itemId));
    } else {
      // Add the item with quantity 1
      onItemsChange([...selectedItems, { id: itemId, quantity: 1 }]);
    }
  };
  
  const handleQuantityChange = (itemId: string, quantity: number) => {
    // Ensure quantity is at least 1
    const validQuantity = Math.max(1, quantity);
    
    onItemsChange(
      selectedItems.map(item => 
        item.id === itemId ? { ...item, quantity: validQuantity } : item
      )
    );
  };
  
  // Calculate total price for dry cleaning items
  const calculateDryCleaningTotal = (): number => {
    return selectedItems.reduce((total, item) => {
      const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
      return total + ((itemDetails?.price || 0) * item.quantity);
    }, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Artículos de Tintorería</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {dryCleaningItems.map((item) => {
            const selectedItem = selectedItems.find(i => i.id === item.id);
            const isSelected = !!selectedItem;
            
            return (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`drycleaning-${item.id}`}
                      checked={isSelected}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <Label 
                      htmlFor={`drycleaning-${item.id}`}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">${item.price.toLocaleString()}</span>
                </div>
                
                {isSelected && (
                  <div className="flex items-center mt-2">
                    <span className="text-sm mr-2">Cantidad:</span>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, (selectedItem?.quantity || 1) - 1)}
                        disabled={(selectedItem?.quantity || 1) <= 1}
                      >
                        -
                      </Button>
                      <Input
                        className="h-8 w-12 mx-1 text-center p-1"
                        value={selectedItem?.quantity || 1}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        min="1"
                        type="number"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.id, (selectedItem?.quantity || 1) + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mt-4 text-right font-semibold">
            Total Tintorería: ${calculateDryCleaningTotal().toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DryCleaningOptions;
