
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

interface ResetConfirmDialogProps {
  isResetting: boolean;
  handleResetCounters: () => Promise<void>;
  someSelected: boolean;
}

export const ResetConfirmDialog: React.FC<ResetConfirmDialogProps> = ({
  isResetting,
  handleResetCounters,
  someSelected
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={!someSelected}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reiniciar Contadores Seleccionados
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción reiniciará los contadores seleccionados del dashboard como si la aplicación estuviera recién construida.
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span className="text-green-800 text-sm">
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
            className="bg-green-500 hover:bg-green-600"
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
