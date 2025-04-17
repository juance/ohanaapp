import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

export const ResetAllParameters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
      
      setShowConfirmation(false);
      
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
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-600 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Reiniciar Todos los Parámetros
        </CardTitle>
        <CardDescription>
          Reinicia todos los parámetros de la aplicación como si estuviera recién instalada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Atención! Acción irreversible</AlertTitle>
            <AlertDescription>
              Está a punto de reiniciar TODOS los parámetros de la aplicación, incluyendo:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Dashboard: Contadores de tickets, ventas y métricas</li>
                <li>Clientes: Datos de fidelidad y contadores</li>
                <li>Pedidos a Retirar: Todos los tickets pendientes</li>
                <li>Entregados: Historial de tickets entregados</li>
                <li>Programa de Fidelidad: Puntos y beneficios acumulados</li>
                <li>Análisis de Tickets: Datos históricos y estadísticas</li>
              </ul>
              <p className="mt-2 font-medium">Esta acción no puede deshacerse. ¿Está seguro que desea continuar?</p>
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            Esta función reiniciará todos los parámetros de la aplicación, incluyendo contadores, 
            tickets, datos de clientes, programa de fidelidad y más. Use esta función solo si necesita 
            reiniciar completamente la aplicación.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {showConfirmation ? (
          <>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isResetting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reiniciando...
                </>
              ) : (
                'Confirmar Reinicio Total'
              )}
            </Button>
          </>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setShowConfirmation(true)}
          >
            Reiniciar Todos los Parámetros
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
