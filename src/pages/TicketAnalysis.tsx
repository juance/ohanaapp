
import React from 'react';
import Navbar from '@/components/Navbar';
import { DateRangeSelector } from '@/components/analysis/DateRangeSelector';
import { MetricsSection } from '@/components/analysis/MetricsSection';
import { ChartTabs } from '@/components/analysis/ChartTabs';
import { ActionButtons } from '@/components/analysis/ActionButtons';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TicketAnalysisProps {
  embedded?: boolean;
}

const TicketAnalysis: React.FC<TicketAnalysisProps> = ({ embedded = false }) => {
  const {
    metrics,
    chartData,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData
  } = useTicketAnalytics();
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-gray-500">Análisis de Tickets</p>
        </header>
      )}
      
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
          <ActionButtons exportData={exportData} />
        </div>
        
        <MetricsSection metrics={metrics} isLoading={isLoading} error={error} />
        
        <ChartTabs chartData={chartData} isLoading={isLoading} error={error} />
      </div>
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
