
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface LaundryOptionItem {
  id: string;
  label: string;
}

interface LaundryOptionsSectionProps {
  laundryOptionsList: LaundryOptionItem[];
  selectedLaundryOptions: string[];
  handleLaundryOptionToggle: (optionId: string) => void;
}

const LaundryOptionsSection: React.FC<LaundryOptionsSectionProps> = ({
  laundryOptionsList,
  selectedLaundryOptions,
  handleLaundryOptionToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Laundry Options</h3>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {laundryOptionsList.map((option) => (
          <div
            key={option.id}
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
              selectedLaundryOptions.includes(option.id)
                ? 'border-laundry-500 bg-laundry-50'
                : 'border-border'
            }`}
            onClick={() => handleLaundryOptionToggle(option.id)}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`option-${option.id}`}
                checked={selectedLaundryOptions.includes(option.id)}
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

export default LaundryOptionsSection;
