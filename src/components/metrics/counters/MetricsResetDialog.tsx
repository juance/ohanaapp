
import React from 'react';
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
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, AlertTriangle } from "lucide-react";

interface MetricsResetDialogProps {
  isResetting: boolean;
  handleResetCounters: () => Promise<void>;
  someSelected: boolean;
}

export const MetricsResetDialog: React.FC<MetricsResetDialogProps> = ({
  isResetting,
  handleResetCounters,
  someSelected
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!someSelected}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reiniciar Métricas Seleccionadas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción reiniciará los contadores de métricas seleccionados como si la aplicación estuviera recién construida.
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <span className="text-blue-800 text-sm">
                Esta acción no se puede deshacer. Los datos históricos se perderán.
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleResetCounters}
            disabled={isResetting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isResetting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reiniciando...
              </>
            ) : (
              "Confirmar Reinicio"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
