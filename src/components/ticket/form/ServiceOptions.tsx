import React from 'react';
import { LaundryService } from '@/lib/types';  // Updated import

interface ServiceOptionsProps {
  laundryServices: LaundryService[];
  selectedServices: string[];
  handleServiceToggle: (serviceId: string) => void;
}

const ServiceOptions: React.FC<ServiceOptionsProps> = ({
  laundryServices,
  selectedServices,
  handleServiceToggle
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {laundryServices.map((service) => (
        <div
          key={service.id}
          className={`border rounded-lg p-3 cursor-pointer ${
            selectedServices.includes(service.id)
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => handleServiceToggle(service.id)}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{service.name}</span>
            <span className="text-blue-600">${service.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceOptions;
