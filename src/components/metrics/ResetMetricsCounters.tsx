import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast";
import {
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Users,
  BarChart,
  LineChart
} from "lucide-react";
import { resetMetricsCounters } from '@/lib/resetMetricsService';

export const ResetMetricsCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<{
    tickets: boolean;
    clients: boolean;
    revenue: boolean;
    clientTypes: boolean;
  }>({
    tickets: true,
    clients: true,
    revenue: true,
    clientTypes: true
  });

  const handleResetCounters = async () => {
    setIsResetting(true);
    try {
      // Call the resetMetricsCounters function with the selected metrics
      const success = await resetMetricsCounters(selectedMetrics);

      if (success) {
        toast.success("Contadores de métricas reiniciados", {
          description: "Los contadores de métricas han sido reiniciados exitosamente."
        });

        // Refresh the page after a short delay to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Error al reiniciar contadores de métricas", {
          description: "Algunos contadores no pudieron ser reiniciados."
        });
      }
    } catch (error) {
      console.error('Error resetting metrics counters:', error);
      toast.error("Error al reiniciar contadores de métricas", {
        description: "Ocurrió un error al reiniciar los contadores de métricas."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const allSelected = Object.values(selectedMetrics).every(Boolean);
  const someSelected = Object.values(selectedMetrics).some(Boolean);

  const toggleAll = () => {
    const newValue = !allSelected;
    setSelectedMetrics({
      tickets: newValue,
      clients: newValue,
      revenue: newValue,
      clientTypes: newValue
    });
  };

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-600 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Reiniciar Contadores de Métricas
        </CardTitle>
        <CardDescription>
          Reinicia los contadores de métricas seleccionados como si la aplicación estuviera recién construida.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-metrics"
              checked={allSelected}
              onCheckedChange={toggleAll}
            />
            <label
              htmlFor="all-metrics"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Seleccionar todas las métricas
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tickets"
                checked={selectedMetrics.tickets}
                onCheckedChange={() => toggleMetric('tickets')}
              />
              <label
                htmlFor="tickets"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <ShoppingBag className="h-4 w-4 text-blue-500" />
                Tickets
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clients"
                checked={selectedMetrics.clients}
                onCheckedChange={() => toggleMetric('clients')}
              />
              <label
                htmlFor="clients"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Users className="h-4 w-4 text-green-500" />
                Clientes
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="revenue"
                checked={selectedMetrics.revenue}
                onCheckedChange={() => toggleMetric('revenue')}
              />
              <label
                htmlFor="revenue"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <LineChart className="h-4 w-4 text-yellow-500" />
                Ingresos por Día
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clientTypes"
                checked={selectedMetrics.clientTypes}
                onCheckedChange={() => toggleMetric('clientTypes')}
              />
              <label
                htmlFor="clientTypes"
                className="flex items-center gap-1.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <BarChart className="h-4 w-4 text-purple-500" />
                Tipos de Clientes
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div className="text-blue-800 text-sm">
            <p className="font-medium">Esta acción reiniciará:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Contadores de tickets</li>
              <li>Contadores de clientes</li>
              <li>Datos de ingresos por día</li>
              <li>Distribución de tipos de clientes</li>
            </ul>
            <p className="mt-2 font-medium">Los datos de clientes se mantendrán, pero sus contadores se reiniciarán a cero.</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={!someSelected}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar Métricas Seleccionadas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción reiniciará los contadores de métricas seleccionados como si la aplicación estuviera recién construida.
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span className="text-blue-800 text-sm">
                    Esta acción no se puede deshacer. Los datos históricos se perderán.
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetCounters}
                disabled={isResetting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Reiniciando...
                  </>
                ) : (
                  "Confirmar Reinicio"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
