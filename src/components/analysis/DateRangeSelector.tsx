
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangeSelectorProps {
  from: Date;
  to: Date;
  onUpdate: (from: Date, to: Date) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ from, to, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-auto justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(from, "dd MMM", { locale: es })} - {format(to, "dd MMM yyyy", { locale: es })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <div className="text-sm font-medium">Seleccionar período</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Desde</label>
              <Calendar
                mode="single"
                selected={from}
                onSelect={(date) => date && onUpdate(date, to)}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Hasta</label>
              <Calendar
                mode="single"
                selected={to}
                onSelect={(date) => date && onUpdate(from, date)}
                className="rounded-md border"
                disabled={(date) => date < from}
              />
            </div>
          </div>
          <Button size="sm" onClick={() => setIsOpen(false)} className="w-full">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
