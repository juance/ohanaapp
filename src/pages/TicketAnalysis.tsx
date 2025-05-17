
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import DateRangeSelector from '@/components/analysis/DateRangeSelector';
import ActionButtons from '@/components/analysis/ActionButtons';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/lib/toast';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import DateFilterButtons from '@/components/analytics/DateFilterButtons';
import { DateFilterType } from '@/lib/analytics/interfaces';

interface TicketAnalysisProps {
  embedded?: boolean;
}

const TicketAnalysis: React.FC<TicketAnalysisProps> = ({ embedded = false }) => {
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('month');
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    setIsComponentMounted(true);
    return () => setIsComponentMounted(false);
  }, []);

  // Get analytics data
  const {
    data,
    previousPeriodData,
    isLoading,
    error,
    dateRange,
    setDateRange,
    exportData
  } = useTicketAnalytics();

  // Handler function for exporting data
  const handleExport = async () => {
    try {
      toast({
        title: "Info",
        description: "Exportando datos..."
      });
      await exportData();
      toast({
        title: "Success",
        description: "Datos exportados correctamente"
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al exportar los datos"
      });
    }
  };

  // Handler for date range changes
  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  // If component isn't mounted yet, show loading
  if (!isComponentMounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading className="h-8 w-8" />
      </div>
    );
  }

  // Get period label based on active filter
  const getPeriodLabel = () => {
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
        return 'Periodo seleccionado';
    }
  };

  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Análisis de Tickets</h1>
          <p className="text-gray-500">Visualiza y analiza datos de ventas</p>
        </header>
      )}

      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="w-full md:w-auto">
          <DateFilterButtons 
            onFilterChange={setDateRange}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <div className="mt-2">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateRangeChange} 
            />
          </div>
        </div>
        <ActionButtons onExportData={handleExport} />
      </div>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Loading />
        </div>
      ) : error ? (
        <div className="space-y-4">
          <ErrorMessage message={`Error al cargar datos: ${error.message}`} />
          <Button onClick={() => window.location.reload()} variant="outline" className="mx-auto block">
            Reintentar
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <MetricsSection 
            loading={isLoading} 
            analytics={data} 
            previousAnalytics={previousPeriodData}
            periodLabel={getPeriodLabel()}
          />
          <ChartTabs loading={isLoading} analytics={data} />
        </div>
      )}
    </>
  );
  
  if (embedded) {
    return content;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
