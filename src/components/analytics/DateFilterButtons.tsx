
import React from 'react';
import { Button } from '@/components/ui/button';
import { DateFilterType, DateRange } from '@/lib/analytics/interfaces';
import { subDays, subWeeks, subMonths, subQuarters, subYears, startOfDay, endOfDay } from 'date-fns';

interface DateFilterButtonsProps {
  onFilterChange: (range: DateRange) => void;
  activeFilter: DateFilterType;
  setActiveFilter: (filter: DateFilterType) => void;
}

const DateFilterButtons: React.FC<DateFilterButtonsProps> = ({
  onFilterChange,
  activeFilter,
  setActiveFilter
}) => {
  const handleFilterClick = (filter: DateFilterType) => {
    setActiveFilter(filter);
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'day':
        startDate = startOfDay(now);
        onFilterChange({ from: startDate, to: endOfDay(now) });
        break;
      case 'week':
        startDate = subWeeks(now, 1);
        onFilterChange({ from: startDate, to: now });
        break;
      case 'month':
        startDate = subMonths(now, 1);
        onFilterChange({ from: startDate, to: now });
        break;
      case 'quarter':
        startDate = subQuarters(now, 1);
        onFilterChange({ from: startDate, to: now });
        break;
      case 'year':
        startDate = subYears(now, 1);
        onFilterChange({ from: startDate, to: now });
        break;
      default:
        break;
    }
  };

  const filters = [
    { key: 'day' as DateFilterType, label: 'Hoy' },
    { key: 'week' as DateFilterType, label: '7 días' },
    { key: 'month' as DateFilterType, label: '30 días' },
    { key: 'quarter' as DateFilterType, label: '3 meses' },
    { key: 'year' as DateFilterType, label: '1 año' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick(filter.key)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default DateFilterButtons;
