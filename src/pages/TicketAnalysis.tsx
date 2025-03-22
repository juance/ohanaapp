
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import DateRangeSelector from '@/components/analysis/DateRangeSelector';
import MetricsSection from '@/components/analysis/MetricsSection';
import ChartTabs from '@/components/analysis/ChartTabs';
import ActionButtons from '@/components/analysis/ActionButtons';
import { Link } from 'react-router-dom';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';

interface TicketAnalysisProps {
  embedded?: boolean;
}

const TicketAnalysis: React.FC<TicketAnalysisProps> = ({ embedded = false }) => {
  const {
    data,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData,
  } = useTicketAnalytics();

  // Create an onRangeChange handler for DateRangeSelector
  const handleRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
  };
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Análisis de Tickets</h1>
          <p className="text-gray-500">Ver datos y tendencias de tickets</p>
        </header>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start justify-between">
        <DateRangeSelector 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          onRangeChange={handleRangeChange}
        />
        <ActionButtons onExport={exportData} />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
          <p className="text-red-700">{error.message}</p>
        </div>
      ) : (
        <>
          <MetricsSection data={data} />
          <ChartTabs data={data} />
        </>
      )}
    </>
  );
  
  if (embedded) {
    return content;
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
