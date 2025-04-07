
import React from 'react';

interface DryCleaningItem {
  id: string;
  name: string;
  price: number;
}

interface DryCleaningOptionsProps {
  dryCleaningOptions: DryCleaningItem[];
  selectedDryCleaningItems: { id: string; quantity: number }[];
  handleDryCleaningToggle: (itemId: string) => void;
  handleDryCleaningQuantityChange: (itemId: string, quantity: number) => void;
}

const DryCleaningOptions: React.FC<DryCleaningOptionsProps> = ({
  dryCleaningOptions,
  selectedDryCleaningItems,
  handleDryCleaningToggle,
  handleDryCleaningQuantityChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {dryCleaningOptions.map((item) => {
        const selectedItem = selectedDryCleaningItems.find(
          (selected) => selected.id === item.id
        );
        const isSelected = !!selectedItem;

        return (
          <div
            key={item.id}
            className={`border rounded-lg p-3 cursor-pointer ${
              isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleDryCleaningToggle(item.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{item.name}</span>
              <span className="text-blue-600">${item.price}</span>
            </div>

            {isSelected && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">Cantidad:</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedItem && selectedItem.quantity > 1) {
                        handleDryCleaningQuantityChange(
                          item.id,
                          selectedItem.quantity - 1
                        );
                      }
                    }}
                  >
                    -
                  </button>
                  <span>{selectedItem?.quantity || 0}</span>
                  <button
                    type="button"
                    className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedItem) {
                        handleDryCleaningQuantityChange(
                          item.id,
                          selectedItem.quantity + 1
                        );
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DryCleaningOptions;
