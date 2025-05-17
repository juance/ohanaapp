
import React, { useState } from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import DateRangeSelector from '@/components/analysis/DateRangeSelector';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { toast } from '@/lib/toast';

const TicketMetrics: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    exportData
  } = useTicketAnalytics();

  // Handler para exportar datos
  const handleExport = async () => {
    try {
      toast.info("Exportando datos de métricas...");
      await exportData();
      toast.success("Datos exportados correctamente");
    } catch (err) {
      console.error("Error al exportar datos:", err);
      toast.error("Error al exportar los datos");
    }
  };

  // Handler para imprimir
  const handlePrint = () => {
    toast.info("Preparando impresión...");
    window.print();
  };

  // Handler para cambio de rango de fechas
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
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
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
              <MetricsSection loading={isLoading} analytics={data} />
              <ChartTabs loading={isLoading} analytics={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketMetrics;
