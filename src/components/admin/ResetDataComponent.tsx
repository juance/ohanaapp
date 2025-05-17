
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import { RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
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
  const [isResetting, setIsResetting] = useState(false);

  const handleResetLoyaltyProgram = async () => {
    setIsResetting(true);
    try {
      console.log("Resetting loyalty program data...");
      
      // Call the Supabase function to reset loyalty program data
      const { data, error } = await supabase.functions.invoke("reset_loyalty_program");

      if (error) {
        console.error("Error from reset_loyalty_program function:", error);
        throw error;
      }

      console.log("Reset loyalty response:", data);

      toast({
        title: "Programa de fidelidad reiniciado",
        description: "Los datos del programa de fidelidad han sido reiniciados exitosamente."
      });

      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting loyalty program:', error);
      toast({
        title: "Error al reiniciar programa de fidelidad",
        description: error instanceof Error ? error.message : "Ocurrió un error al reiniciar el programa de fidelidad."
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
          Reiniciar Datos
        </CardTitle>
        <CardDescription>
          Reiniciar datos del sistema. Esta acción no se puede deshacer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div className="text-red-800 text-sm">
              <p className="font-medium">Esta acción reiniciará:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Puntos de fidelidad de todos los clientes</li>
                <li>Contadores de valets</li>
                <li>Valets gratuitos asignados a clientes</li>
              </ul>
              <p className="mt-2 font-medium">Los datos de clientes se mantendrán, pero los contadores relacionados se reiniciarán a cero.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="default"
              className="w-full bg-red-500 hover:bg-red-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar Programa de Fidelidad
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción reiniciará todos los datos del programa de fidelidad.
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <span className="text-red-800 text-sm">
                    Esta acción no se puede deshacer. Los datos se perderán permanentemente.
                  </span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetLoyaltyProgram}
                disabled={isResetting}
                className="bg-red-500 hover:bg-red-600"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
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
