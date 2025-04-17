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
import { RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

export const QuickResetButton = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      // Llamar a la función resetAllCounters
      const { data, error } = await supabase.functions.invoke("reset_counters", {
        body: { counter: "all" }
      });

      if (error) throw error;

      toast.success("Todos los parámetros reiniciados", {
        description: "Todos los parámetros han sido reiniciados exitosamente."
      });
      
      // Recargar la página después de un breve retraso para mostrar los datos actualizados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al reiniciar todos los parámetros:', error);
      toast.error("Error al reiniciar parámetros", {
        description: error instanceof Error ? error.message : "Ocurrió un error al reiniciar los parámetros."
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reiniciar Todo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción reiniciará TODOS los parámetros de la aplicación, incluyendo:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Dashboard: Contadores de tickets, ventas y métricas</li>
              <li>Clientes: Datos de fidelidad y contadores</li>
              <li>Pedidos a Retirar: Todos los tickets pendientes</li>
              <li>Entregados: Historial de tickets entregados</li>
              <li>Programa de Fidelidad: Puntos y beneficios acumulados</li>
              <li>Análisis de Tickets: Datos históricos y estadísticas</li>
            </ul>
            <p className="mt-2 font-medium text-red-600">Esta acción no puede deshacerse.</p>
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
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reiniciando...
              </>
            ) : (
              "Confirmar Reinicio Total"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
