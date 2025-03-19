
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateRangeSelectorProps {
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  onRangeChange: (from: Date, to: Date) => void;
}

const DateRangeSelector = ({ dateRange, setDateRange, onRangeChange }: DateRangeSelectorProps) => {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left sm:w-auto">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'dd/MM/yy', { locale: es })} -{' '}
                {format(dateRange.to, 'dd/MM/yy', { locale: es })}
              </>
            ) : (
              format(dateRange.from, 'PP', { locale: es })
            )
          ) : (
            <span>Seleccionar rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange.from}
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setDateRange({ from: range.from, to: range.to });
              onRangeChange(range.from, range.to);
            }
          }}
          numberOfMonths={isMobile ? 1 : 2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
