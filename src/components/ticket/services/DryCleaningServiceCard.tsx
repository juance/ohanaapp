
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Package } from 'lucide-react';

export interface DryCleaningService {
  id: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
}

export interface SelectedService extends DryCleaningService {
  quantity: number;
}

interface DryCleaningServiceCardProps {
  service: DryCleaningService;
  quantity: number;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  isSelected: boolean;
}

const DryCleaningServiceCard: React.FC<DryCleaningServiceCardProps> = ({
  service,
  quantity,
  onQuantityChange,
  isSelected
}) => {
  const handleIncrement = () => {
    onQuantityChange(service.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(service.id, quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(0, parseInt(e.target.value) || 0);
    onQuantityChange(service.id, newQuantity);
  };

  const totalPrice = service.price * quantity;

  return (
    <Card className={`transition-all duration-200 ${
      isSelected 
        ? 'ring-2 ring-blue-500 bg-blue-50' 
        : 'hover:shadow-md border-gray-200'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium text-gray-900">{service.name}</h4>
              {service.category && (
                <Badge variant="outline" className="text-xs">
                  {service.category}
                </Badge>
              )}
            </div>
            {service.description && (
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-blue-600">
                ${service.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">por unidad</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={quantity === 0}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={handleInputChange}
              className="w-16 text-center h-8"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {quantity > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                ${totalPrice.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DryCleaningServiceCard;
