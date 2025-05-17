
import React from 'react';
import { Button } from '@/components/ui/button';
import { DateRange, DateFilterType } from '@/lib/analytics/interfaces';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subQuarters, startOfQuarter, endOfQuarter } from 'date-fns';

interface DateFilterButtonsProps {
  onFilterChange: (range: DateRange) => void;
  activeFilter: DateFilterType;
  setActiveFilter: (filter: DateFilterType) => void;
}

const DateFilterButtons = ({ onFilterChange, activeFilter, setActiveFilter }: DateFilterButtonsProps) => {
  
  const handleFilterClick = (filterType: DateFilterType) => {
    setActiveFilter(filterType);
    
    const now = new Date();
    let newRange: DateRange;
    
    switch (filterType) {
      case 'day':
        newRange = {
          from: startOfDay(now),
          to: endOfDay(now)
        };
        break;
      case 'week':
        newRange = {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 })
        };
        break;
      case 'month':
        newRange = {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
        break;
      case 'quarter':
        newRange = {
          from: startOfQuarter(now),
          to: endOfQuarter(now)
        };
        break;
      case 'custom':
        // For custom, we don't change the date range here
        // as it will be set by the date picker
        return;
      default:
        newRange = {
          from: subDays(now, 30),
          to: now
        };
    }
    
    onFilterChange(newRange);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={activeFilter === 'day' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => handleFilterClick('day')}
      >
        Hoy
      </Button>
      <Button 
        variant={activeFilter === 'week' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => handleFilterClick('week')}
      >
        Esta semana
      </Button>
      <Button 
        variant={activeFilter === 'month' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => handleFilterClick('month')}
      >
        Este mes
      </Button>
      <Button 
        variant={activeFilter === 'quarter' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => handleFilterClick('quarter')}
      >
        Este trimestre
      </Button>
    </div>
  );
};

export default DateFilterButtons;
