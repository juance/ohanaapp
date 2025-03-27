
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SelectedDryCleaningItem, DryCleaningOption } from './types';

interface DryCleaningItemsProps {
  dryCleaningOptions: DryCleaningOption[];
  selectedItems: SelectedDryCleaningItem[];
  onItemToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

const DryCleaningItems: React.FC<DryCleaningItemsProps> = ({
  dryCleaningOptions,
  selectedItems,
  onItemToggle,
  onQuantityChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dry Cleaning Items</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {dryCleaningOptions.map((item) => {
          const selectedItem = selectedItems.find(i => i.id === item.id);
          return (
            <div
              key={item.id}
              className={`flex cursor-pointer flex-col rounded-lg border p-3 transition-all ${
                selectedItem
                  ? 'border-laundry-500 bg-laundry-50'
                  : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`drycleaning-${item.id}`}
                    checked={!!selectedItem}
                    onCheckedChange={() => onItemToggle(item.id)}
                    className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor={`drycleaning-${item.id}`}
                    className="text-sm font-medium"
                  >
                    {item.name}
                  </label>
                </div>
                <span className="text-sm font-semibold">${item.price}</span>
              </div>
              
              {selectedItem && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedItem.quantity > 1) {
                          onQuantityChange(item.id, selectedItem.quantity - 1);
                        }
                      }}
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-4 text-center">
                      {selectedItem.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuantityChange(item.id, selectedItem.quantity + 1);
                      }}
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
    </div>
  );
};

export default DryCleaningItems;
