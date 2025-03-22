
import React from 'react';
import Navbar from '@/components/Navbar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  embedded?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ embedded = false }) => {
  const { data, isLoading, error } = useDashboardData();
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Volver al Inicio</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-gray-500">Panel de Control</p>
        </header>
      )}
      
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
          <p className="text-red-700">{error.message}</p>
        </div>
      ) : (
        <>
          <MetricsCards data={data} />
          <ChartSection data={data} />
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

export default Dashboard;
