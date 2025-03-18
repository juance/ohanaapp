
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define dry cleaning items with their prices
export const dryCleaningItems = [
  { id: 'lavado_valet', name: 'Lavado (valet)', price: 5000 },
  { id: 'secado', name: 'Secado', price: 4000 },
  { id: 'lavado_mano', name: 'Lavado a mano (por 3 prendas)', price: 5000 },
  { id: 'lavado_zapatillas', name: 'Lavado de zapatillas (por par)', price: 10000 },
  { id: 'lavado_mantas', name: 'Lavado de mantas, cortinas y colchas (doble secado)', price: 8000 },
  { id: 'ambo_comun', name: 'Ambo común', price: 19000 },
  { id: 'ambo_lino', name: 'Ambo lino', price: 22000 },
  { id: 'blusa', name: 'Blusa', price: 8600 },
  { id: 'buzo', name: 'Buzo', price: 9800 },
  { id: 'traje', name: 'Traje', price: 29000 },
  { id: 'traje_especial', name: 'Traje (especial)', price: 34000 },
  { id: 'saco', name: 'Saco', price: 12000 },
  { id: 'saco_especial', name: 'Saco (especial)', price: 14000 },
  { id: 'sacon', name: 'Sacón', price: 13000 },
  { id: 'pantalon', name: 'Pantalón vestir', price: 8000 },
  { id: 'pantalon_lino', name: 'Pantalón lino', price: 9200 },
  { id: 'pantalon_sky', name: 'Pantalón Sky', price: 14000 },
  { id: 'campera_sky', name: 'Campera Sky', price: 18000 },
  { id: 'pollera', name: 'Pollera', price: 9000 },
  { id: 'pollera_especial', name: 'Pollera (especial)', price: 14400 },
  { id: 'pollera_tableada', name: 'Pollera tableada', price: 11000 },
  { id: 'pollera_tableada_especial', name: 'Pollera tableada (especial)', price: 16000 },
  { id: 'pullover', name: 'Pullover', price: 9600 },
  { id: 'pullover_especial', name: 'Pullover (especial)', price: 13000 },
  { id: 'saco_lana', name: 'Saco de lana', price: 10600 },
  { id: 'saco_lana_especial', name: 'Saco de lana (especial)', price: 15600 },
  { id: 'camisa', name: 'Camisa', price: 8000 },
  { id: 'remera', name: 'Remera', price: 9200 },
  { id: 'corbata', name: 'Corbata', price: 7000 },
  { id: 'chaleco', name: 'Chaleco', price: 10000 },
  { id: 'chaqueta', name: 'Chaqueta', price: 13000 },
  { id: 'campera', name: 'Campera', price: 13000 },
  { id: 'camperon', name: 'Camperón', price: 14600 },
  { id: 'campera_desmontable', name: 'Campera desmontable', price: 15600 },
  { id: 'campera_desmontable_especial', name: 'Campera desmontable (especial)', price: 18000 },
  { id: 'campera_inflable', name: 'Campera inflable/plumas', price: 14600 },
  { id: 'tapado', name: 'Tapado', price: 14600 },
  { id: 'sobretodo', name: 'Sobretodo', price: 16400 },
  { id: 'camperon_inflable', name: 'Camperón inflable o plumas', price: 16400 },
  { id: 'tapado_especial', name: 'Tapado (especial)', price: 18000 },
  { id: 'piloto_simple', name: 'Piloto simple', price: 14000 },
  { id: 'piloto_simple_especial', name: 'Piloto simple (especial)', price: 19000 },
  { id: 'piloto_desmontable', name: 'Piloto desmontable', price: 18000 },
  { id: 'vestido_comun', name: 'Vestido común', price: 14000 },
  { id: 'vestido_comun_especial', name: 'Vestido común (especial)', price: 19000 },
  { id: 'vestido_fiesta', name: 'Vestido de fiesta desde', price: 22000 },
  { id: 'vestido_15', name: 'Vestido de 15 años desde', price: 34000 },
  { id: 'vestido_novia', name: 'Vestido de novia desde', price: 40000 },
  { id: 'frazada', name: 'Frazada', price: 14000 },
  { id: 'frazada_especial', name: 'Frazada (especial)', price: 18000 },
  { id: 'acolchado', name: 'Acolchado', price: 16000 },
  { id: 'acolchado_especial', name: 'Acolchado (especial)', price: 20000 },
  { id: 'acolchado_plumas', name: 'Acolchado de plumas', price: 16000 },
  { id: 'acolchado_plumas_especial', name: 'Acolchado de plumas (especial)', price: 22000 },
  { id: 'funda_colchon', name: 'Funda de colchón', price: 19000 },
  { id: 'funda_colchon_especial', name: 'Funda de colchón (especial)', price: 28000 },
  { id: 'cortina_liviana', name: 'Cortina liviana x mt2', price: 7600 },
  { id: 'cortina_pesada', name: 'Cortina pesada x mt2', price: 8400 },
  { id: 'cortina_forrada', name: 'Cortina forrada x mt2', price: 9200 },
  { id: 'alfombra', name: 'Alfombra x mt2', price: 18000 },
  { id: 'funda_acolchado', name: 'Funda de acolchado', price: 14000 },
  { id: 'funda_acolchado_especial', name: 'Funda de acolchado (especial)', price: 19000 },
  { id: 'almohada', name: 'Almohada', price: 12000 },
  { id: 'almohada_plumas', name: 'Almohada plumas', price: 16000 },
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
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Filter items based on search term
  const filteredItems = dryCleaningItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Artículos de Tintorería</CardTitle>
        <div className="mt-2">
          <Input
            type="text"
            placeholder="Buscar artículo..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredItems.map((item) => {
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
                      className="cursor-pointer truncate"
                    >
                      {item.name}
                    </Label>
                  </div>
                  <span className="text-sm font-medium shrink-0">${item.price.toLocaleString()}</span>
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
