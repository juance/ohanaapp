
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';

export interface DryCleaningService {
  id: string;
  name: string;
  price: number;
  priceMax?: number;
  category: string;
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
  const formatPrice = (service: DryCleaningService): string => {
    if (service.priceMax && service.priceMax !== service.price) {
      return `$${service.price.toLocaleString()} - $${service.priceMax.toLocaleString()}`;
    }
    return `$${service.price.toLocaleString()}`;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Básico': 'bg-blue-100 text-blue-800',
      'Formal': 'bg-purple-100 text-purple-800',
      'Casual': 'bg-green-100 text-green-800',
      'Abrigo': 'bg-orange-100 text-orange-800',
      'Vestidos': 'bg-pink-100 text-pink-800',
      'Hogar': 'bg-indigo-100 text-indigo-800',
      'Trabajo': 'bg-yellow-100 text-yellow-800',
      'Pantalones': 'bg-gray-100 text-gray-800',
      'Polleras': 'bg-rose-100 text-rose-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={`transition-all duration-200 ${
      isSelected 
        ? 'ring-2 ring-blue-500 shadow-md bg-blue-50' 
        : 'hover:shadow-md hover:bg-gray-50'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 leading-tight">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-xs text-gray-600 mt-1">
                  {service.description}
                </p>
              )}
            </div>
            <Badge className={`ml-2 text-xs ${getCategoryColor(service.category)}`}>
              {service.category}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-blue-600">
              {formatPrice(service)}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(service.id, Math.max(0, quantity - 1))}
                className="h-8 w-8 p-0"
                disabled={quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 0;
                  onQuantityChange(service.id, newQuantity);
                }}
                className="w-16 text-center h-8"
              />
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(service.id, quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Total for this service */}
            {quantity > 0 && (
              <div className="text-right">
                <div className="font-semibold text-green-600">
                  ${(service.price * quantity).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Total
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DryCleaningServiceCard;
