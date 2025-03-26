
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateRangeSelectorProps {
  dateRange: { from: Date; to: Date };
  setDateRange: (range: { from: Date; to: Date }) => void;
  minDate?: Date;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  dateRange, 
  setDateRange,
  minDate
}) => {
  const isMobile = useIsMobile();
  
  // Calcular fecha mínima predeterminada (90 días atrás)
  const defaultMinDate = new Date();
  defaultMinDate.setDate(defaultMinDate.getDate() - 90);
  
  // Usar la fecha mínima proporcionada o la predeterminada
  const effectiveMinDate = minDate || defaultMinDate;

  return (
    <div className="mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal sm:w-auto">
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
              <span>Seleccionar período</span>
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
            onSelect={(selectedRange) => {
              if (selectedRange?.from && selectedRange?.to) {
                setDateRange({ from: selectedRange.from, to: selectedRange.to });
              }
            }}
            numberOfMonths={isMobile ? 1 : 2}
            fromDate={effectiveMinDate} // Permitir seleccionar desde la fecha mínima
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
