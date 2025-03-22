
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMetricsData } from '@/hooks/useMetricsData';
import { DateRangeSelector } from '@/components/metrics/DateRangeSelector';
import { MetricsCards } from '@/components/metrics/MetricsCards';
import { RevenueChart } from '@/components/metrics/RevenueChart';
import { ServiceBreakdownChart } from '@/components/metrics/ServiceBreakdownChart';
import { ClientTypeChart } from '@/components/metrics/ClientTypeChart';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface MetricsProps {
  embedded?: boolean;
}

const Metrics: React.FC<MetricsProps> = ({ embedded = false }) => {
  const { 
    data, 
    isLoading, 
    error, 
    dateRange, 
    setDateRange 
  } = useMetricsData();
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-gray-500">Métricas</p>
        </header>
      )}
      
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <div className="space-y-6">
          <MetricsCards data={data} />
          <RevenueChart data={data} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceBreakdownChart data={data} />
            <ClientTypeChart data={data} />
          </div>
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
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
