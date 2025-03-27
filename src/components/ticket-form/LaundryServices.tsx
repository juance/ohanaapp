
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export interface LaundryService {
  id: string;
  name: string;
  price: number;
}

interface LaundryServicesProps {
  laundryServices: LaundryService[];
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
}

const LaundryServices: React.FC<LaundryServicesProps> = ({ 
  laundryServices, 
  selectedServices, 
  onServiceToggle 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Services</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {laundryServices.map((service) => (
          <div
            key={service.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
              selectedServices.includes(service.id)
                ? 'border-laundry-500 bg-laundry-50'
                : 'border-border'
            }`}
            onClick={() => onServiceToggle(service.id)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => {}}
                className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
              />
              <label
                htmlFor={`service-${service.id}`}
                className="text-sm font-medium"
              >
                {service.name}
              </label>
            </div>
            <span className="text-sm font-semibold">${service.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaundryServices;
