
import React from 'react';
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
}

export const DateRangeSelector = ({ dateRange, setDateRange }: DateRangeSelectorProps) => {
  const isMobile = useIsMobile();
  
  // Calcular fecha mínima (90 días atrás)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 90);

  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setDateRange({ from: range.from, to: range.to });
    }
  };

  return (
    <div className="mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left sm:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from && dateRange.to ? (
              <>
                {format(dateRange.from, 'dd/MM/yy', { locale: es })} -{' '}
                {format(dateRange.to, 'dd/MM/yy', { locale: es })}
              </>
            ) : (
              <span>Seleccionar rango</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={handleDateRangeSelect}
            numberOfMonths={isMobile ? 1 : 2}
            fromDate={minDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
