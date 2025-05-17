
import React, { useState } from 'react';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Users, ChartBarIcon, CalendarDays, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import DateFilterButtons from '@/components/analytics/DateFilterButtons';
import ComparativeMetricsCard from '@/components/analytics/ComparativeMetricsCard';
import { DateFilterType } from '@/lib/analytics/interfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Analysis: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('month');
  
  const { 
    data: analytics, 
    previousPeriodData,
    isLoading, 
    isComparativeLoading,
    dateRange, 
    setDateRange,
    exportData,
    refreshData
  } = useTicketAnalytics();

  const getPeriodLabel = () => {
    if (!dateRange.from || !dateRange.to) return 'Periodo seleccionado';
    
    switch (activeFilter) {
      case 'day':
        return 'Hoy';
      case 'week':
        return 'Esta semana';
      case 'month':
        return 'Este mes';
      case 'quarter':
        return 'Este trimestre';
      default:
        return `${format(dateRange.from, 'dd/MM/yy', { locale: es })} - ${format(dateRange.to, 'dd/MM/yy', { locale: es })}`;
    }
  };

  const handleDateRangeChange = (range: any) => {
    setActiveFilter('custom');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
      
      <DateFilterButtons 
        onFilterChange={setDateRange}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Metrics Overview */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <>
          {/* Period label */}
          <div className="text-sm text-muted-foreground mb-2">
            {activeFilter === 'custom' ? 'Periodo personalizado' : getPeriodLabel()}
            {isComparativeLoading && ' (Calculando comparativas...)'}
          </div>
          
          {/* Main metrics */}
          <MetricsSection 
            loading={isLoading} 
            analytics={analytics} 
            previousAnalytics={previousPeriodData}
            periodLabel={getPeriodLabel()}
          />
          
          {/* Additional metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <ComparativeMetricsCard
              title="Clientes Nuevos"
              currentValue={analytics?.newCustomers || 0}
              previousValue={previousPeriodData?.newCustomers}
              icon={<Users className="h-4 w-4" />}
              period={getPeriodLabel()}
            />
            <ComparativeMetricsCard
              title="Tickets Pendientes"
              currentValue={analytics?.ticketsByStatus?.pending || 0}
              previousValue={previousPeriodData?.ticketsByStatus?.pending}
              icon={<CalendarDays className="h-4 w-4" />}
              period={getPeriodLabel()}
            />
            <ComparativeMetricsCard
              title="Tickets Entregados"
              currentValue={analytics?.ticketsByStatus?.delivered || 0}
              previousValue={previousPeriodData?.ticketsByStatus?.delivered}
              icon={<ChartBarIcon className="h-4 w-4" />}
              period={getPeriodLabel()}
            />
            <ComparativeMetricsCard
              title="Valets Gratis"
              currentValue={analytics?.freeValets || 0}
              previousValue={previousPeriodData?.freeValets}
              icon={<TrendingUp className="h-4 w-4" />}
              period={getPeriodLabel()}
            />
          </div>
          
          {/* Charts */}
          <div className="mt-8">
            <ChartTabs 
              loading={isLoading} 
              analytics={analytics} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis;
