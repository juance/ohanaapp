
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DateRangeSelector from '@/components/analytics/DateRangeSelector';
import ActionButtons from '@/components/analytics/ActionButtons';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Metrics: React.FC = () => {
  const {
    isLoading,
    error,
    analytics,
    dateRange,
    setDateRange,
    exportData
  } = useAnalytics();

  const handleDateChange = (from: Date, to: Date) => {
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

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateChange} 
            />
            <ActionButtons onExportData={exportData} />
          </div>

          {error ? (
            <ErrorMessage 
              title="Error al cargar datos" 
              message={error.message || "Ocurrió un error al cargar los datos."}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="space-y-8">
              <MetricsSection loading={isLoading} analytics={analytics} />
              
              {/* Información adicional específica para la página de métricas */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-blue-700">Resumen del Período</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Período Analizado</h3>
                      <p className="mt-1 text-lg">
                        {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Total Tickets</h3>
                      <p className="mt-1 text-lg">{analytics?.totalTickets || 0}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Total Facturado</h3>
                      <p className="mt-1 text-lg">${analytics?.totalRevenue.toLocaleString('es-AR') || 0}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Ticket Promedio</h3>
                      <p className="mt-1 text-lg">${analytics?.averageTicketValue.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <ChartTabs loading={isLoading} analytics={analytics} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
