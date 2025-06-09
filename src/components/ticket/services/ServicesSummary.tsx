
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, DollarSign, Package } from 'lucide-react';
import { SelectedService } from './DryCleaningServiceCard';

interface ServicesSummaryProps {
  selectedServices: SelectedService[];
  showDetails?: boolean;
}

const ServicesSummary: React.FC<ServicesSummaryProps> = ({
  selectedServices,
  showDetails = true
}) => {
  const totalItems = selectedServices.reduce((sum, service) => sum + service.quantity, 0);
  const totalAmount = selectedServices.reduce((sum, service) => sum + (service.price * service.quantity), 0);

  if (selectedServices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No hay servicios seleccionados</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Resumen de Servicios
          <Badge variant="secondary" className="ml-auto">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showDetails && (
          <div className="space-y-3">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between items-center py-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    {service.quantity} x ${service.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ${(service.price * service.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <Separator />
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-lg">Total:</span>
          </div>
          <span className="text-2xl font-bold text-green-600">
            ${totalAmount.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesSummary;
