
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export const ResetClientCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setIsResetting(true);
    setError(null);
    
    try {
      console.log('Calling reset_all_loyalty_points function...');
      
      const { data, error } = await supabase.rpc('reset_all_loyalty_points');

      if (error) {
        console.error('Error calling reset_all_loyalty_points:', error);
        throw new Error(`Error al reiniciar puntos de fidelidad: ${error.message}`);
      }

      console.log('Reset function completed successfully. Affected customers:', data);
      
      // Show success message with count
      const affectedCount = data || 0;
      console.log(`Puntos de fidelidad reiniciados para ${affectedCount} clientes`);
      
      setShowConfirmation(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al reiniciar puntos de fidelidad';
      console.error('Error in handleReset:', errorMessage);
      setError(errorMessage);
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
              onClick={() => {
                setShowConfirmation(false);
                setError(null);
              }}
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
            disabled={isResetting}
          >
            Reiniciar Puntos de Fidelidad
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
