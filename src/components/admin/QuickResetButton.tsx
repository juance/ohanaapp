
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Loader2, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

type ResetCategory = 'dashboard' | 'clients' | 'pending' | 'delivered' | 'loyalty' | 'analysis' | 'metrics' | 'all';

export const QuickResetButton = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [resetCategory, setResetCategory] = useState<ResetCategory>('all');

  const handleReset = async () => {
    setIsResetting(true);
    try {
      let functionName = "reset_all_data_complete";
      let payload = {};
      
      // If not resetting everything, use the reset_counters function with specific counters
      if (resetCategory !== 'all') {
        functionName = "reset_counters";
        
        // Map categories to the appropriate counter names for the backend
        const counterMapping: Record<ResetCategory, string> = {
          dashboard: "tickets",
          clients: "clients",
          pending: "tickets",
          delivered: "tickets",
          loyalty: "loyalty",
          analysis: "tickets",
          metrics: "revenue",
          all: "all"
        };
        
        payload = { counter: counterMapping[resetCategory] };
      }
      
      console.log(`Resetting ${resetCategory} data using ${functionName}...`);
      const { data, error } = await supabase.functions.invoke(functionName, { body: payload });

      if (error) throw error;

      let successMessage = "Datos reiniciados correctamente";
      let description = "La operación se ha completado con éxito.";
      
      switch (resetCategory) {
        case 'dashboard':
          successMessage = "Contadores del Dashboard reiniciados";
          description = "Los contadores del panel han sido reiniciados exitosamente.";
          break;
        case 'clients':
          successMessage = "Datos de clientes reiniciados";
          description = "La información de fidelidad de los clientes ha sido reiniciada.";
          break;
        case 'pending':
          successMessage = "Pedidos pendientes reiniciados";
          description = "Todos los pedidos pendientes han sido eliminados.";
          break;
        case 'delivered':
          successMessage = "Historial de entregas reiniciado";
          description = "El historial de pedidos entregados ha sido eliminado.";
          break;
        case 'loyalty':
          successMessage = "Programa de fidelidad reiniciado";
          description = "Los puntos y beneficios del programa de fidelidad han sido reiniciados.";
          break;
        case 'analysis':
          successMessage = "Análisis de tickets reiniciado";
          description = "Los datos de análisis de tickets han sido reiniciados.";
          break;
        case 'metrics':
          successMessage = "Métricas reiniciadas";
          description = "Todas las métricas y estadísticas han sido reiniciadas.";
          break;
        case 'all':
          successMessage = "Reinicio completo exitoso";
          description = "Todos los parámetros han sido reiniciados exitosamente.";
          break;
      }

      toast.success(successMessage, {
        description: description
      });

      // Recargar la página después de un breve retraso para mostrar los datos actualizados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al reiniciar los datos:', error);
      toast.error("Error al reiniciar datos", {
        description: error instanceof Error ? error.message : "Ocurrió un error al reiniciar los datos."
      });
    } finally {
      setIsResetting(false);
    }
  };

  const getResetDetails = () => {
    switch (resetCategory) {
      case 'dashboard':
        return {
          title: "Reiniciar Contadores del Dashboard",
          description: "Esta acción reiniciará todos los contadores del panel principal, incluyendo tickets, ventas y métricas."
        };
      case 'clients':
        return {
          title: "Reiniciar Datos de Clientes",
          description: "Esta acción reiniciará toda la información de fidelidad de los clientes, incluyendo puntos y beneficios acumulados."
        };
      case 'pending':
        return {
          title: "Reiniciar Pedidos Pendientes",
          description: "Esta acción eliminará todos los tickets pendientes de retirar del sistema."
        };
      case 'delivered':
        return {
          title: "Reiniciar Pedidos Entregados",
          description: "Esta acción eliminará todo el historial de tickets entregados."
        };
      case 'loyalty':
        return {
          title: "Reiniciar Programa de Fidelidad",
          description: "Esta acción reiniciará todos los puntos y beneficios acumulados en el programa de fidelidad."
        };
      case 'analysis':
        return {
          title: "Reiniciar Análisis de Tickets",
          description: "Esta acción eliminará todos los datos históricos y estadísticas de análisis de tickets."
        };
      case 'metrics':
        return {
          title: "Reiniciar Métricas",
          description: "Esta acción reiniciará todas las métricas y estadísticas del sistema."
        };
      default:
        return {
          title: "Reinicio Completo del Sistema",
          description: "Esta acción reiniciará TODOS los parámetros de la aplicación como si estuviera recién instalada."
        };
    }
  };

  const resetDetails = getResetDetails();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'dashboard' ? 'border-blue-500 bg-blue-50' : ''}
          onClick={() => setResetCategory('dashboard')}
        >
          Dashboard
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'clients' ? 'border-green-500 bg-green-50' : ''}
          onClick={() => setResetCategory('clients')}
        >
          Clientes
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'pending' ? 'border-amber-500 bg-amber-50' : ''}
          onClick={() => setResetCategory('pending')}
        >
          Pedidos Pendientes
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'delivered' ? 'border-purple-500 bg-purple-50' : ''}
          onClick={() => setResetCategory('delivered')}
        >
          Entregados
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'loyalty' ? 'border-yellow-500 bg-yellow-50' : ''}
          onClick={() => setResetCategory('loyalty')}
        >
          Fidelidad
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'analysis' ? 'border-red-500 bg-red-50' : ''}
          onClick={() => setResetCategory('analysis')}
        >
          Análisis
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'metrics' ? 'border-indigo-500 bg-indigo-50' : ''}
          onClick={() => setResetCategory('metrics')}
        >
          Métricas
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className={resetCategory === 'all' ? 'border-rose-500 bg-rose-50' : ''}
          onClick={() => setResetCategory('all')}
        >
          Todo
        </Button>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            {resetDetails.title}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{resetDetails.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {resetDetails.description}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-amber-800 font-medium">Esta acción no puede deshacerse.</p>
                <p className="text-amber-700 text-sm mt-1">
                  Los datos serán eliminados permanentemente y no podrán ser recuperados.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reiniciando...
                </>
              ) : (
                "Confirmar Reinicio"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
