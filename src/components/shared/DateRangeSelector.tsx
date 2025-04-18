
import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateRangeSelectorProps {
  from: Date;
  to: Date;
  onUpdate: (from: Date, to: Date) => void;
  minDate?: Date;
  className?: string;
}

const DateRangeSelector = ({ from, to, onUpdate, minDate, className }: DateRangeSelectorProps) => {
  const isMobile = useIsMobile();
  
  // Calcular fecha mínima predeterminada (90 días atrás)
  const defaultMinDate = new Date();
  defaultMinDate.setDate(defaultMinDate.getDate() - 90);
  
  // Usar la fecha mínima proporcionada o la predeterminada
  const effectiveMinDate = minDate || defaultMinDate;

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left sm:w-auto">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, 'dd/MM/yy', { locale: es })} -{' '}
                  {format(to, 'dd/MM/yy', { locale: es })}
                </>
              ) : (
                format(from, 'PP', { locale: es })
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
            defaultMonth={from}
            selected={{
              from: from,
              to: to,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onUpdate(range.from, range.to);
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

export default DateRangeSelector;
