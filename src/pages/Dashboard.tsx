
import React from 'react';
import Navbar from '@/components/Navbar';
import MetricsCards from '@/components/dashboard/MetricsCards';
import ChartSection from '@/components/dashboard/ChartSection';
import LoadingState from '@/components/dashboard/LoadingState';
import { SyncDataButton } from '@/components/dashboard/SyncDataButton';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';

interface DashboardProps {
  embedded?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ embedded = false }) => {
  const { 
    isLoading, 
    error, 
    refetch: refreshData,
    dateRange,
    setDateRange: updateDateFilter, 
    ticketsInRange: data,
    incomeInRange,
    serviceCounts,
    dryCleaningItems
  } = useDashboardData();

  console.log('Dashboard component - data:', data);

  const handleRefresh = async () => {
    try {
      toast({
        title: "Actualizando panel de control...",
        description: "Por favor espere mientras se actualizan los datos."
      });
      await refreshData();
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: "No se pudo actualizar el panel de control"
      });
    }
  };

  const handleDateChange = (startDate: Date, endDate: Date) => {
    updateDateFilter({ start: startDate, end: endDate });
  };

  // Prepare chart data objects with proper structure
  const barData = [{ name: 'Tickets', total: data?.length || 0 }];
  
  const lineData = [
    { name: 'Actual', income: incomeInRange || 0, expenses: 0 }
  ];
  
  // Convert dryCleaningItems to pieData format
  const pieData = dryCleaningItems 
    ? Object.entries(dryCleaningItems).map(([name, value]) => ({
        name,
        value: value as number
      }))
    : [{ name: 'Sin datos', value: 1 }];

  const chartData = {
    barData,
    lineData,
    pieData
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

      {/* Añadimos el filtro de fechas */}
      <div className="mb-6">
        <DateRangeFilter 
          startDate={dateRange.start}
          endDate={dateRange.end}
          onDateChange={handleDateChange}
        />
      </div>

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
      ) : !data || data.length === 0 ? (
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
            metrics={{
              todayTickets: data.length,
              todayIncome: incomeInRange,
              pendingTickets: 0,
              totalTickets: data.length
            }}
            expenses={{}}
            viewType="monthly"
            dateRange={{
              from: dateRange.start,
              to: dateRange.end
            }}
          />
          <div className="h-6"></div>
          <ChartSection
            chartData={chartData}
            viewType="monthly"
            frequentClients={[]}
          />

          <div className="mt-8 grid grid-cols-1 gap-6">
            <SyncDataButton />
          </div>
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
