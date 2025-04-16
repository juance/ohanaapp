
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormSubmitSectionProps {
  isPaidInAdvance: boolean;
  setIsPaidInAdvance: (value: boolean) => void;
}

const FormSubmitSection: React.FC<FormSubmitSectionProps> = ({
  isPaidInAdvance,
  setIsPaidInAdvance
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="paid-in-advance-checkbox"
          checked={isPaidInAdvance}
          onChange={() => setIsPaidInAdvance(!isPaidInAdvance)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="paid-in-advance-checkbox" className="text-sm font-medium">
          Cliente dejó pago (Pagado por adelantado)
        </label>
      </div>

      <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
        Generar Ticket
      </Button>
    </div>
  );
};

export default FormSubmitSection;
