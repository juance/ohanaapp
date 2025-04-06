
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

export const ResetClientCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset_counters", {
        body: { counter: "clients" }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: 'Contadores de clientes reiniciados exitosamente'
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al reiniciar los contadores de clientes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al reiniciar los contadores de clientes'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reiniciar Contadores de Clientes</CardTitle>
        <CardDescription>
          Esta acción reiniciará los valets acumulados, valets gratis y puntos de fidelidad de todos los clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Atención!</AlertTitle>
            <AlertDescription>
              Está a punto de reiniciar TODOS los contadores relacionados con clientes, 
              incluyendo valets acumulados, valets gratis y puntos de fidelidad.
              Esta acción no puede deshacerse. ¿Está seguro que desea continuar?
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            Use esta función con precaución. El reinicio afectará a todos los clientes 
            registrados en el sistema y eliminará sus beneficios acumulados.
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
                'Confirmar Reinicio'
              )}
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setShowConfirmation(true)}
          >
            Reiniciar Contadores de Clientes
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
