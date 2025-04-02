
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const ResetTicketNumbers = () => {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase.rpc('reset_ticket_sequence');
      
      if (error) throw error;
      
      toast.success('Numeración de tickets reiniciada exitosamente');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error al reiniciar la numeración de tickets:', error);
      toast.error('Error al reiniciar la numeración de tickets');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reiniciar Numeración de Tickets</CardTitle>
        <CardDescription>
          Esta acción reiniciará la secuencia de números de tickets para que comience desde 1 nuevamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showConfirmation ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>¡Atención!</AlertTitle>
            <AlertDescription>
              Está a punto de reiniciar la numeración de tickets. Esta acción no puede deshacerse.
              ¿Está seguro que desea continuar?
            </AlertDescription>
          </Alert>
        ) : (
          <p className="text-sm text-muted-foreground">
            Use esta función con precaución. El reinicio de la numeración de tickets afectará a todos los tickets nuevos 
            que se generen a partir de este momento.
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
            Reiniciar Numeración
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
