
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { LaundryServiceOption } from './types';

interface LaundryOptionsSelectorProps {
  options: LaundryServiceOption[];
  selectedOptions: string[];
  onOptionToggle: (optionId: string) => void;
}

const LaundryOptionsSelector: React.FC<LaundryOptionsSelectorProps> = ({
  options,
  selectedOptions,
  onOptionToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Laundry Options</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
              selectedOptions.includes(option.id)
                ? 'border-laundry-500 bg-laundry-50'
                : 'border-border'
            }`}
            onClick={() => onOptionToggle(option.id)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedOptions.includes(option.id)}
                onCheckedChange={() => {}}
                className="data-[state=checked]:bg-laundry-500 data-[state=checked]:text-white"
              />
              <label
                htmlFor={`option-${option.id}`}
                className="text-sm font-medium"
              >
                {option.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaundryOptionsSelector;
