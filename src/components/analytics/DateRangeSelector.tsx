
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DateRangeSelectorProps {
  from: Date;
  to: Date;
  onUpdate: (from: Date, to: Date) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  from,
  to,
  onUpdate,
}) => {
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [isToOpen, setIsToOpen] = React.useState(false);
  const [tempFrom, setTempFrom] = React.useState<Date>(from);
  const [tempTo, setTempTo] = React.useState<Date>(to);

  const handleFromSelect = (date: Date | undefined) => {
    if (date) {
      setTempFrom(date);
      setIsFromOpen(false);
      if (date > tempTo) {
        setTempTo(date);
      }
    }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (date) {
      setTempTo(date);
      setIsToOpen(false);
      if (date < tempFrom) {
        setTempFrom(date);
      }
    }
  };

  const applyDateRange = () => {
    onUpdate(tempFrom, tempTo);
  };

  const quickSelect = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    
    setTempFrom(from);
    setTempTo(to);
    onUpdate(from, to);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex gap-2 items-center">
        <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[160px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(tempFrom, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={tempFrom}
              onSelect={handleFromSelect}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>

        <span>-</span>

        <Popover open={isToOpen} onOpenChange={setIsToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[160px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(tempTo, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={tempTo}
              onSelect={handleToSelect}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm" onClick={applyDateRange}>
          Aplicar
        </Button>
      </div>

      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => quickSelect(7)}>
          7d
        </Button>
        <Button variant="ghost" size="sm" onClick={() => quickSelect(30)}>
          30d
        </Button>
        <Button variant="ghost" size="sm" onClick={() => quickSelect(90)}>
          90d
        </Button>
      </div>
    </div>
  );
};

export default DateRangeSelector;
