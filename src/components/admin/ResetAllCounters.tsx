
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

export const ResetAllCounters = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset_counters", {
        body: { counter: "all" }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: 'Todos los contadores han sido reiniciados exitosamente'
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al reiniciar todos los contadores:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al reiniciar los contadores'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reiniciar Todos los Contadores</CardTitle>
        <CardDescription>
          Esta acción reiniciará todos los contadores de la aplicación incluyendo tickets, clientes, ingresos y más
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡ADVERTENCIA!</AlertTitle>
            <AlertDescription>
              Esta es una acción destructiva que reiniciará TODOS los contadores en la aplicación.
              Esta operación no puede deshacerse y afectará datos históricos.
              ¿Está COMPLETAMENTE seguro que desea continuar?
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            Use esta función solo si necesita reiniciar completamente todos los contadores
            del sistema. Esta acción afectará a la numeración de tickets, puntos de fidelidad,
            valets acumulados, e ingresos registrados.
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
            Reiniciar Todos los Contadores
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
