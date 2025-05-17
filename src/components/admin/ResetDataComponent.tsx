
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
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

export const ResetDataComponent = () => {
  const [isResettingLoyalty, setIsResettingLoyalty] = useState(false);
  const [isResettingMetrics, setIsResettingMetrics] = useState(false);

  const handleResetLoyalty = async () => {
    try {
      setIsResettingLoyalty(true);

      // Call the Supabase edge function to reset loyalty data
      const { data, error } = await supabase.functions.invoke('reset_loyalty_program');

      if (error) {
        throw error;
      }

      toast({
        title: "Éxito",
        description: "Programa de fidelidad reiniciado exitosamente. Todos los valores se han establecido en cero."
      });
      
      // Force refresh of the clients page if that's where we are
      if (window.location.pathname.includes('clients')) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Error al reiniciar el programa de fidelidad:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al reiniciar el programa de fidelidad."
      });
    } finally {
      setIsResettingLoyalty(false);
    }
  };

  const handleResetMetrics = async () => {
    try {
      setIsResettingMetrics(true);

      // Call the Supabase edge function to reset metrics
      const { data, error } = await supabase.functions.invoke('reset_metrics');

      if (error) {
        throw error;
      }

      // Also clear local storage metrics-related data
      localStorage.removeItem('metrics_data');
      
      toast({
        title: "Éxito",
        description: "Todas las métricas han sido reiniciadas exitosamente. Valores establecidos en cero."
      });
      
      // Force refresh
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error al reiniciar las métricas:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al reiniciar las métricas."
      });
    } finally {
      setIsResettingMetrics(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <RotateCcw className="h-5 w-5 text-amber-600 mr-2" />
            <CardTitle>Reiniciar Programa de Fidelidad</CardTitle>
          </div>
          <CardDescription>
            Establece en cero todos los puntos de fidelidad y contadores de valets para todos los clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Esta acción reiniciará los siguientes valores para todos los clientes:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Puntos de fidelidad</li>
            <li>Valets acumulados</li>
            <li>Valets gratuitos disponibles</li>
            <li>Valets utilizados</li>
          </ul>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Reiniciar Programa de Fidelidad
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción reiniciará todos los puntos de fidelidad y contadores de valets de los clientes a cero.
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetLoyalty}
                  disabled={isResettingLoyalty}
                >
                  {isResettingLoyalty ? (
                    <span className="flex items-center">
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Reiniciando...
                    </span>
                  ) : (
                    "Sí, reiniciar programa de fidelidad"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <RotateCcw className="h-5 w-5 text-amber-600 mr-2" />
            <CardTitle>Reiniciar Métricas</CardTitle>
          </div>
          <CardDescription>
            Reinicia todas las métricas del sistema a cero para comenzar a recopilar nuevos datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Esta acción reiniciará todas las estadísticas y métricas, incluyendo:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Ventas diarias, semanales y mensuales</li>
            <li>Contadores de tickets</li>
            <li>Datos de ingresos y tendencias</li>
            <li>Distribución de métodos de pago</li>
          </ul>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Reiniciar Todas las Métricas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción borrará todas las métricas y datos estadísticos del sistema.
                  El sistema comenzará a recopilar nuevos datos a partir de ahora.
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetMetrics}
                  disabled={isResettingMetrics}
                >
                  {isResettingMetrics ? (
                    <span className="flex items-center">
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Reiniciando...
                    </span>
                  ) : (
                    "Sí, reiniciar todas las métricas"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
};
