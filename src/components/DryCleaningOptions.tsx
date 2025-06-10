
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
  priceMax?: number; // For price ranges
  category: string;
}

export const dryCleaningItems: DryCleaningOption[] = [
  // Servicios básicos
  { id: 'lavado_valet', name: 'Lavado (valet)', price: 6000, category: 'Básico' },
  { id: 'secado', name: 'Secado', price: 5000, category: 'Básico' },
  { id: 'tratamiento_mano', name: 'Tratamiento a mano (por 3 prendas)', price: 6000, category: 'Básico' },
  { id: 'lavado_zapatillas', name: 'Lavado de zapatillas (por par)', price: 12000, category: 'Básico' },
  { id: 'lavado_mantas', name: 'Lavado de mantas, cortinas y colchas (doble secado)', price: 10000, priceMax: 12000, category: 'Hogar' },

  // Ropa de trabajo
  { id: 'ambo_comun', name: 'Ambo común', price: 22000, category: 'Trabajo' },
  { id: 'ambo_lino', name: 'Ambo lino', price: 25000, category: 'Trabajo' },

  // Ropa casual
  { id: 'blusa', name: 'Blusa', price: 9600, priceMax: 11000, category: 'Casual' },
  { id: 'buzo', name: 'Buzo', price: 9600, priceMax: 11000, category: 'Casual' },
  { id: 'camisa', name: 'Camisa', price: 9000, priceMax: 10400, category: 'Casual' },
  { id: 'remera', name: 'Remera', price: 9000, priceMax: 10400, category: 'Casual' },
  { id: 'pullover', name: 'Pullover', price: 11000, priceMax: 15000, category: 'Casual' },

  // Ropa formal
  { id: 'traje', name: 'Traje', price: 34000, priceMax: 39000, category: 'Formal' },
  { id: 'saco', name: 'Saco', price: 14000, priceMax: 16000, category: 'Formal' },
  { id: 'sacon', name: 'Sacón', price: 15000, category: 'Formal' },
  { id: 'saco_lana', name: 'Saco de lana', price: 13000, priceMax: 18000, category: 'Formal' },
  { id: 'chaleco', name: 'Chaleco', price: 12000, priceMax: 15000, category: 'Formal' },
  { id: 'chaqueta', name: 'Chaqueta', price: 12000, priceMax: 15000, category: 'Formal' },
  { id: 'corbata', name: 'Corbata', price: 8000, category: 'Formal' },

  // Pantalones
  { id: 'pantalon_vestir', name: 'Pantalón vestir', price: 9000, priceMax: 10400, category: 'Pantalones' },
  { id: 'pantalon_lino', name: 'Pantalón lino', price: 9000, priceMax: 10400, category: 'Pantalones' },
  { id: 'pantalon_sky', name: 'Pantalón Sky', price: 16000, category: 'Pantalones' },

  // Polleras
  { id: 'pollera', name: 'Pollera', price: 11000, priceMax: 17000, category: 'Polleras' },
  { id: 'pollera_tableada', name: 'Pollera tableada', price: 13000, priceMax: 18000, category: 'Polleras' },

  // Camperas
  { id: 'campera', name: 'Campera', price: 15000, category: 'Abrigo' },
  { id: 'campera_sky', name: 'Campera Sky', price: 22000, category: 'Abrigo' },
  { id: 'camperon', name: 'Camperón', price: 17000, category: 'Abrigo' },
  { id: 'campera_desmontable', name: 'Campera desmontable', price: 18000, priceMax: 22000, category: 'Abrigo' },
  { id: 'campera_inflable', name: 'Campera inflable/plumas', price: 17000, category: 'Abrigo' },
  { id: 'camperon_inflable', name: 'Camperón inflable o plumas', price: 19000, priceMax: 22000, category: 'Abrigo' },
  { id: 'tapado', name: 'Tapado/Sobretodo', price: 17000, priceMax: 19000, category: 'Abrigo' },
  { id: 'tapado_plumas', name: 'Tapado de plumas', price: 19000, priceMax: 22000, category: 'Abrigo' },

  // Pilotos
  { id: 'piloto_simple', name: 'Piloto simple', price: 16000, priceMax: 20000, category: 'Abrigo' },
  { id: 'piloto_desmontable', name: 'Piloto desmontable', price: 22000, category: 'Abrigo' },

  // Vestidos
  { id: 'vestido_comun', name: 'Vestido común', price: 16000, priceMax: 22000, category: 'Vestidos' },
  { id: 'vestido_fiesta', name: 'Vestido de fiesta', price: 24000, category: 'Vestidos' },
  { id: 'vestido_15', name: 'Vestido de 15 años', price: 36000, category: 'Vestidos' },
  { id: 'vestido_novia', name: 'Vestido de novia', price: 44000, category: 'Vestidos' },

  // Ropa de cama y hogar
  { id: 'frazada', name: 'Frazada', price: 14000, priceMax: 20000, category: 'Hogar' },
  { id: 'acolchado', name: 'Acolchado', price: 17000, priceMax: 22000, category: 'Hogar' },
  { id: 'acolchado_plumas', name: 'Acolchado de plumas', price: 18000, priceMax: 24000, category: 'Hogar' },
  { id: 'funda_colchon', name: 'Funda de colchón', price: 22000, priceMax: 32000, category: 'Hogar' },
  { id: 'funda_acolchado', name: 'Funda de acolchado', price: 16000, priceMax: 22000, category: 'Hogar' },
  { id: 'almohada', name: 'Almohada', price: 14000, priceMax: 16000, category: 'Hogar' },
  { id: 'almohada_plumas', name: 'Almohada plumas', price: 14000, priceMax: 16000, category: 'Hogar' },

  // Cortinas y alfombras (por m²)
  { id: 'cortina_liviana', name: 'Cortina liviana (por m²)', price: 8400, category: 'Hogar' },
  { id: 'cortina_pesada', name: 'Cortina pesada (por m²)', price: 9400, category: 'Hogar' },
  { id: 'cortina_forrada', name: 'Cortina forrada (por m²)', price: 10400, category: 'Hogar' },
  { id: 'alfombra', name: 'Alfombra (por m²)', price: 20000, category: 'Hogar' }
];

interface DryCleaningOptionsProps {
  selectedItems: SelectedDryCleaningItem[];
  onItemsChange: (items: SelectedDryCleaningItem[]) => void;
}

const DryCleaningOptions: React.FC<DryCleaningOptionsProps> = ({
  selectedItems,
  onItemsChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', ...Array.from(new Set(dryCleaningItems.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'Todos' 
    ? dryCleaningItems 
    : dryCleaningItems.filter(item => item.category === selectedCategory);

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
        price: dryCleaningItem.price // Use base price for calculations
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

  const formatPrice = (item: DryCleaningOption): string => {
    if (item.priceMax && item.priceMax !== item.price) {
      return `$${item.price.toLocaleString()} - $${item.priceMax.toLocaleString()}`;
    }
    return `$${item.price.toLocaleString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios de Tintorería</CardTitle>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredItems.map((item) => {
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
                      {formatPrice(item)}
                    </p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
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
