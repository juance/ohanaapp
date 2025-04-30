
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  const [date, setDate] = React.useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  // Predefined date ranges
  const selectToday = () => {
    const today = new Date();
    setDate({ from: today, to: today });
    onDateChange(today, today);
  };

  const selectLastWeek = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    setDate({ from: lastWeek, to: today });
    onDateChange(lastWeek, today);
  };

  const selectLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    setDate({ from: lastMonth, to: today });
    onDateChange(lastMonth, today);
  };

  const selectThisYear = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    setDate({ from: startOfYear, to: today });
    onDateChange(startOfYear, today);
  };

  // Handle date selection from calendar
  const handleSelect = (selectedDate: { from: Date; to: Date | undefined }) => {
    setDate(selectedDate);
    if (selectedDate.from && selectedDate.to) {
      onDateChange(selectedDate.from, selectedDate.to);
    }
  };

  return (
    <div>
      <div className="mb-2 text-sm font-medium">Filtrar por fecha</div>
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              size="sm"
              className={cn(
                "w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy", { locale: es })} -{" "}
                    {format(date.to, "dd/MM/yyyy", { locale: es })}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy", { locale: es })
                )
              ) : (
                <span>Seleccionar fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="sm" onClick={selectToday}>
          Hoy
        </Button>
        <Button variant="outline" size="sm" onClick={selectLastWeek}>
          Última semana
        </Button>
        <Button variant="outline" size="sm" onClick={selectLastMonth}>
          Último mes
        </Button>
        <Button variant="outline" size="sm" onClick={selectThisYear}>
          Este año
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
