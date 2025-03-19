
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import DateRangeSelector from '@/components/analysis/DateRangeSelector';
import ActionButtons from '@/components/analysis/ActionButtons';
import MetricsSection from '@/components/analysis/MetricsSection';
import ChartTabs from '@/components/analysis/ChartTabs';

const TicketAnalysis = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  });
  
  const { loading, analytics, refreshData } = useTicketAnalytics(dateRange.from, dateRange.to);
  
  const handleRefresh = async () => {
    await refreshData(dateRange.from, dateRange.to);
    toast.success('Datos actualizados');
  };
  
  const handleDateRangeChange = (from: Date, to: Date) => {
    refreshData(from, to);
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Análisis de Tickets</h1>
              <p className="text-muted-foreground">
                Análisis detallado de ventas y tickets
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <DateRangeSelector 
                dateRange={dateRange} 
                setDateRange={setDateRange} 
                onRangeChange={handleDateRangeChange}
              />
              <ActionButtons 
                loading={loading}
                analytics={analytics}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
          
          <MetricsSection loading={loading} analytics={analytics} />
          
          <div className="mt-8">
            <ChartTabs loading={loading} analytics={analytics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
