
import React from 'react';
import Navbar from '@/components/Navbar';
import MetricsCards from '@/components/dashboard/MetricsCards';
import ChartSection from '@/components/dashboard/ChartSection';
import LoadingState from '@/components/dashboard/LoadingState';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardProps {
  embedded?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ embedded = false }) => {
  const { data, isLoading, error, refreshData } = useDashboardData();
  
  const handleRefresh = async () => {
    try {
      toast.info("Actualizando panel de control...");
      await refreshData();
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      toast.error("Error al actualizar el panel de control");
    }
  };
  
  const content = (
    <>
      {!embedded && (
        <header className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
            <p className="text-gray-500">Panel de Control</p>
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
      )}
      
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
          <p className="text-red-700">{error.message}</p>
          <Button 
            onClick={handleRefresh} 
            variant="destructive" 
            size="sm"
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      ) : !data || Object.keys(data.metrics).length === 0 ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="text-lg font-medium text-yellow-800">No hay datos disponibles</h3>
          <p className="text-yellow-700">No se encontraron datos para mostrar en el panel de control.</p>
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
          <MetricsCards 
            metrics={data.metrics} 
            expenses={data.expenses} 
            viewType="monthly" 
          />
          <div className="h-6"></div>
          <ChartSection 
            chartData={data.chartData} 
            viewType="monthly"
            frequentClients={data.clients}
          />
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
