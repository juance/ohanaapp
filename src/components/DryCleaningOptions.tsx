import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';

// Define dry cleaning items with their prices
export const dryCleaningItems = [
  { id: 'lavado_valet', name: 'Lavado (valet)', price: 6000 },
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
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  const handleAddItem = () => {
    if (!selectedItemId) return;
    
    // Check if item already exists
    const existingItem = selectedItems.find(item => item.id === selectedItemId);
    
    if (existingItem) {
      // Update existing item quantity
      onItemsChange(
        selectedItems.map(item => 
          item.id === selectedItemId ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      // Add new item
      onItemsChange([...selectedItems, { id: selectedItemId, quantity }]);
    }
    
    // Reset form
    setSelectedItemId('');
    setQuantity(1);
  };
  
  const handleRemoveItem = (itemId: string) => {
    onItemsChange(selectedItems.filter(item => item.id !== itemId));
  };
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    // Ensure quantity is at least 1
    const validQuantity = Math.max(1, newQuantity);
    
    onItemsChange(
      selectedItems.map(item => 
        item.id === itemId ? { ...item, quantity: validQuantity } : item
      )
    );
  };
  
  // Get item details by ID
  const getItemDetails = (itemId: string) => {
    return dryCleaningItems.find(item => item.id === itemId);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Item Selector */}
          <div className="flex flex-col gap-4 sm:flex-row items-end">
            <div className="flex-1">
              <Label htmlFor="item-select">Seleccionar Artículo</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar artículo" />
                </SelectTrigger>
                <SelectContent>
                  {dryCleaningItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - ${item.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/4">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="mt-1"
              />
            </div>
            <Button 
              type="button" 
              onClick={handleAddItem} 
              disabled={!selectedItemId}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </Button>
          </div>
          
          {/* Selected Items Table */}
          {selectedItems.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artículo</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map(item => {
                    const itemDetails = getItemDetails(item.id);
                    if (!itemDetails) return null;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{itemDetails.name}</TableCell>
                        <TableCell className="text-right">${itemDetails.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Input
                              className="h-8 w-16 mx-1 text-center"
                              value={item.quantity}
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
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(itemDetails.price * item.quantity).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t">
                <div className="text-right font-semibold text-lg">
                  Total: ${selectedItems.reduce((sum, item) => {
                    const itemDetails = getItemDetails(item.id);
                    return sum + (itemDetails ? itemDetails.price * item.quantity : 0);
                  }, 0).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              No hay artículos seleccionados. Agregue artículos desde el menú desplegable.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DryCleaningOptions;
