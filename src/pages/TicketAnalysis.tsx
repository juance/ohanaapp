
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DateRangeSelector from '@/components/shared/DateRangeSelector';
import ActionButtons from '@/components/analysis/ActionButtons';
import MetricsSection from '@/components/analytics/MetricsSection';
import ChartTabs from '@/components/analytics/ChartTabs';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { Loading } from '@/components/ui/loading';

interface TicketAnalysisProps {
  embedded?: boolean;
}

const TicketAnalysis: React.FC<TicketAnalysisProps> = ({ embedded = false }) => {
  const [exporting, setExporting] = useState(false);

  // Get analytics data
  const {
    data,
    isLoading,
    error,
    dateRange,
    setDateRange,
    exportData
  } = useTicketAnalytics();

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportData();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Handler for date range changes
  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

  if (!data && isLoading) {
    return (
      <div className={embedded ? "" : "flex min-h-screen flex-col md:flex-row"}>
        {!embedded && <Navbar />}
        <div className={embedded ? "" : "flex-1 p-6 md:ml-64"}>
          <div className="flex h-96 items-center justify-center">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

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
        <DateRangeSelector 
          from={dateRange.from} 
          to={dateRange.to} 
          onUpdate={handleDateRangeChange} 
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
          <MetricsSection metrics={data} loading={isLoading} analytics={data} />
          <ChartTabs chartData={data} loading={isLoading} analytics={data} />
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
