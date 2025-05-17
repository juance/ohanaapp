
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import ActionButtons from '@/components/analytics/ActionButtons';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { ErrorMessage } from '@/components/ui/error-message';
import { Card } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const {
    isLoading,
    error,
    analytics,
    dateRange,
    setDateRange,
    exportData
  } = useAnalytics();

  const handleRefresh = async () => {
    window.location.reload();
  };

  const handleDateChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Panel de Control</h1>
              <p className="text-gray-500">Métricas y análisis de tickets</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar Datos
            </Button>
          </header>

          <div className="mb-6">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateChange}
            />
          </div>

          {error ? (
            <ErrorMessage 
              title="Error al cargar datos" 
              message={error.message || "Ocurrió un error al cargar los datos del dashboard."}
              onRetry={handleRefresh}
            />
          ) : !analytics ? (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="text-lg font-medium text-yellow-800">No hay datos disponibles</h3>
              <p className="text-yellow-700">No se encontraron tickets para el rango de fechas seleccionado.</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Cargar Datos
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-end">
                <ActionButtons onExportData={exportData} />
              </div>
              
              <div className="space-y-8">
                <MetricsSection loading={isLoading} analytics={analytics} />
                <ChartTabs loading={isLoading} analytics={analytics} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
