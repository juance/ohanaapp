import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DateRangeSelector } from '@/components/DateRangeSelector';
import { ActionButtons } from '@/components/ActionButtons';
import { MetricsSection } from '@/components/analytics/MetricsSection';
import { ChartTabs } from '@/components/analytics/ChartTabs';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { Loading } from '@/components/ui/loading';

const TicketAnalysis = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setExporting(false);
  };

  // Get analytics data
  const {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange: updateDateRange,
    exportData,
    refreshData
  } = useTicketAnalytics();

  // Adapt the setDateRange function to match the expected format
  const setDateRange = (range: { from: Date; to: Date }) => {
    updateDateRange(range.from, range.to);
  };

  // Handler functions
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
            <h1 className="text-2xl font-bold text-blue-600">Análisis de Tickets</h1>
            <p className="text-gray-500">Visualiza y analiza datos de ventas</p>
          </header>

          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={(from, to) => updateDateRange(from, to)} 
            />
            <ActionButtons onExportData={handleExport} />
          </div>

          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
              <p className="text-red-700">{error.message}</p>
            </div>
          ) : (
            <div className="space-y-8">
              <MetricsSection metrics={data} />
              <ChartTabs chartData={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
