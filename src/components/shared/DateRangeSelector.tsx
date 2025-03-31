
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateRangeSelectorProps {
  from: Date;
  to: Date;
  onUpdate: (from: Date, to: Date) => void;
  minDate?: Date;
}

const DateRangeSelector = ({ from, to, onUpdate, minDate }: DateRangeSelectorProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [manualFromDate, setManualFromDate] = useState(format(from, 'yyyy-MM-dd'));
  const [manualToDate, setManualToDate] = useState(format(to, 'yyyy-MM-dd'));
  
  // Calcular fecha mínima predeterminada (90 días atrás)
  const defaultMinDate = new Date();
  defaultMinDate.setDate(defaultMinDate.getDate() - 90);
  
  // Usar la fecha mínima proporcionada o la predeterminada
  const effectiveMinDate = minDate || defaultMinDate;

  const handleManualDateChange = () => {
    const fromDate = new Date(manualFromDate);
    const toDate = new Date(manualToDate);
    
    if (isValid(fromDate) && isValid(toDate)) {
      onUpdate(fromDate, toDate);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-date">Desde</Label>
              <Input 
                id="from-date" 
                type="date" 
                value={manualFromDate}
                onChange={(e) => setManualFromDate(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <Label htmlFor="to-date">Hasta</Label>
              <Input 
                id="to-date" 
                type="date" 
                value={manualToDate}
                onChange={(e) => setManualToDate(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleManualDateChange}
            className="w-full"
          >
            Aplicar rango
          </Button>
          
          <div className="text-center text-sm text-gray-500">- o -</div>
          
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
                setManualFromDate(format(range.from, 'yyyy-MM-dd'));
                setManualToDate(format(range.to, 'yyyy-MM-dd'));
                setIsOpen(false);
              }
            }}
            numberOfMonths={isMobile ? 1 : 2}
            fromDate={effectiveMinDate}
            className="pointer-events-auto"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
