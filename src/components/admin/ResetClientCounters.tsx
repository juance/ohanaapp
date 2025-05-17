
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
      const { data, error } = await supabase.functions.invoke("reset_loyalty_points", {});

      if (error) throw error;

      toast({
        title: "Success",
        description: 'Todos los puntos de fidelidad han sido reiniciados a cero'
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al reiniciar los puntos de fidelidad:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al reiniciar los puntos de fidelidad'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reiniciar Puntos de Fidelidad</CardTitle>
        <CardDescription>
          Esta acción reiniciará todos los puntos de fidelidad de los clientes a cero
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Atención!</AlertTitle>
            <AlertDescription>
              Está a punto de reiniciar TODOS los puntos de fidelidad a cero.
              Esta acción no puede deshacerse. ¿Está seguro que desea continuar?
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            Use esta función con precaución. El reinicio afectará a todos los clientes 
            registrados en el sistema y eliminará sus puntos acumulados.
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
            Reiniciar Puntos de Fidelidad
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
