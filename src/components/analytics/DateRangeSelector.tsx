
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar
} from '@/components/ui/calendar';

interface DateRangeSelectorProps {
  from: Date;
  to: Date;
  onUpdate: (from: Date, to: Date) => void;
}

const DateRangeSelector = ({ from, to, onUpdate }: DateRangeSelectorProps) => {
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [isToOpen, setIsToOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <span className="text-sm font-medium text-gray-500">Rango de fechas:</span>
      
      <div className="flex items-center gap-2">
        <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{format(from, 'dd/MM/yyyy', { locale: es })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={from}
              onSelect={(date) => {
                if (date) {
                  onUpdate(date, to);
                  setIsFromOpen(false);
                }
              }}
              initialFocus
              disabled={(date) => date > to || date > new Date()}
            />
          </PopoverContent>
        </Popover>
        
        <span>a</span>
        
        <Popover open={isToOpen} onOpenChange={setIsToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{format(to, 'dd/MM/yyyy', { locale: es })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={to}
              onSelect={(date) => {
                if (date) {
                  onUpdate(from, date);
                  setIsToOpen(false);
                }
              }}
              initialFocus
              disabled={(date) => date < from || date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex gap-2 mt-2 sm:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            onUpdate(weekAgo, today);
          }}
        >
          7 días
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const today = new Date();
            const monthAgo = new Date();
            monthAgo.setDate(today.getDate() - 30);
            onUpdate(monthAgo, today);
          }}
        >
          30 días
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const today = new Date();
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(today.getMonth() - 3);
            onUpdate(threeMonthsAgo, today);
          }}
        >
          3 meses
        </Button>
      </div>
    </div>
  );
};

export default DateRangeSelector;
