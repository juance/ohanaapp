
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, RefreshCw, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMetricsData } from '@/hooks/useMetricsData';
import { DateRangeSelector } from '@/components/metrics/DateRangeSelector';
import { MetricsCards } from '@/components/metrics/MetricsCards';
import { RevenueChart } from '@/components/metrics/RevenueChart';
import { ServiceBreakdownChart } from '@/components/metrics/ServiceBreakdownChart';
import { ClientTypeChart } from '@/components/metrics/ClientTypeChart';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

interface MetricsProps {
  embedded?: boolean;
}

const Metrics: React.FC<MetricsProps> = ({ embedded = false }) => {
  const { 
    data, 
    isLoading, 
    error, 
    dateRange, 
    setDateRange,
    refreshData
  } = useMetricsData();
  
  const [isResetting, setIsResetting] = useState(false);
  
  const handleRefresh = async () => {
    toast("Actualizando datos...");
    await refreshData();
  };

  const handleResetMetrics = async () => {
    try {
      setIsResetting(true);
      
      // Reset metrics data directly using an SQL query instead of RPC
      const { error: resetError } = await supabase
        .from('tickets')  // This directly affects metrics since they're based on tickets
        .update({ is_canceled: true, cancel_reason: 'Reset por administrador' })
        .gt('id', '0');
      
      if (resetError) throw resetError;
      
      toast.success("Datos de métricas reiniciados correctamente");
      await refreshData();
    } catch (err) {
      console.error("Error resetting metrics data:", err);
      toast.error("Error al reiniciar los datos de métricas");
    } finally {
      setIsResetting(false);
    }
  };
  
  console.log("Current metrics data:", data);
  
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
            <p className="text-gray-500">Métricas</p>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={isResetting}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar Métricas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Reiniciar datos de métricas?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción reiniciará todos los datos de métricas a cero. Esto incluye información de clientes, tickets, ingresos y servicios.
                    Esta acción no puede deshacerse.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetMetrics}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar Datos
            </Button>
          </div>
        </header>
      )}
      
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />

      {isLoading ? (
        <div className="my-8">
          <Loading className="mx-auto" />
          <p className="text-center text-muted-foreground mt-4">Cargando datos de métricas...</p>
        </div>
      ) : error ? (
        <div className="space-y-4 my-8">
          <ErrorMessage message={`Error al cargar métricas: ${error.message}`} />
          <Button onClick={handleRefresh} variant="destructive" className="mx-auto block">
            Reintentar
          </Button>
        </div>
      ) : !data ? (
        <div className="text-center my-8">
          <p className="text-lg text-muted-foreground">No hay datos disponibles</p>
          <Button onClick={handleRefresh} className="mt-4">
            Cargar Datos
          </Button>
        </div>
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
