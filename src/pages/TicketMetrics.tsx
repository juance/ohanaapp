
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAnalytics } from '@/hooks/useAnalytics';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import ActionButtons from '@/components/analytics/ActionButtons';

const TicketMetrics: React.FC = () => {
  const {
    isLoading,
    error,
    analytics,
    dateRange,
    setDateRange,
    exportData
  } = useAnalytics();

  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Métricas de Tickets</h1>
            <p className="text-gray-500">Análisis detallado de ventas y rendimiento</p>
          </header>

          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateRangeChange} 
            />
            <ActionButtons onExportData={exportData} />
          </div>

          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="space-y-4">
              <ErrorMessage message={`Error al cargar datos: ${error.message}`} />
            </div>
          ) : analytics ? (
            <div className="space-y-8">
              <MetricsSection loading={isLoading} analytics={analytics} />
              <ChartTabs loading={isLoading} analytics={analytics} />
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketMetrics;
