
import React from 'react';
import { DateRange } from '@/lib/analytics/interfaces';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';

const Analysis: React.FC = () => {
  const { 
    data: analytics, 
    isLoading, 
    dateRange, 
    setDateRange,
    exportData,
    refreshData
  } = useTicketAnalytics();

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleExport = async () => {
    await exportData();
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Análisis de Tickets</h1>
        
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker
            value={{
              from: dateRange.from,
              to: dateRange.to
            }}
            onChange={handleDateRangeChange}
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <>
          <MetricsSection 
            loading={isLoading} 
            analytics={analytics} 
          />
          
          <ChartTabs 
            loading={isLoading} 
            analytics={analytics} 
          />
        </>
      )}
    </div>
  );
};

export default Analysis;
