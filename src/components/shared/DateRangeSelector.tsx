
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
  const [tempFrom, setTempFrom] = useState<Date>(from);
  const [tempTo, setTempTo] = useState<Date>(to);

  const handleApply = () => {
    onUpdate(tempFrom, tempTo);
    setIsOpen(false);
  };

  const handleQuickSelect = (days: number) => {
    const newTo = new Date();
    const newFrom = new Date();
    newFrom.setDate(newFrom.getDate() - days);
    setTempFrom(newFrom);
    setTempTo(newTo);
    onUpdate(newFrom, newTo);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-auto justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(from, "dd MMM", { locale: es })} - {format(to, "dd MMM yyyy", { locale: es })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-4 space-y-4">
          <div className="text-sm font-medium">Seleccionar período</div>
          
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickSelect(7)}>
              Últimos 7 días
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickSelect(30)}>
              Últimos 30 días
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickSelect(90)}>
              Últimos 3 meses
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickSelect(365)}>
              Último año
            </Button>
          </div>

          {/* Custom Date Selection */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Fecha inicio</label>
              <Calendar
                mode="single"
                selected={tempFrom}
                onSelect={(date) => date && setTempFrom(date)}
                className="rounded-md border"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600">Fecha fin</label>
              <Calendar
                mode="single"
                selected={tempTo}
                onSelect={(date) => date && setTempTo(date)}
                className="rounded-md border"
                disabled={(date) => date < tempFrom}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleApply}>
              Aplicar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
