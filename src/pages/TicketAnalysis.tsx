
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { ActionButtons } from '@/components/analysis/ActionButtons';
import { ChartTabs } from '@/components/analysis/ChartTabs';
import { DateRangeSelector } from '@/components/analysis/DateRangeSelector';
import { MetricsSection } from '@/components/analysis/MetricsSection';
import { Loading } from '@/components/ui/loading';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TicketAnalysis: React.FC = () => {
  const {
    data,
    dateRange,
    setDateRange,
    isLoading,
    error,
    exportData
  } = useTicketAnalytics();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <div className="container mx-auto">
          <header className="mb-6">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Análisis de Tickets</h1>
            <p className="text-gray-500">Visualiza estadísticas y tendencias de ventas</p>
          </header>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <DateRangeSelector 
                dateRange={dateRange} 
                onDateChange={setDateRange}
              />
              
              <ActionButtons 
                onExport={exportData}
                isLoading={isLoading}
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loading />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
                <p className="text-red-700">{error.message || 'Hubo un error al cargar los datos de análisis'}</p>
              </div>
            ) : (
              <>
                <MetricsSection data={data} />
                <ChartTabs data={data} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
