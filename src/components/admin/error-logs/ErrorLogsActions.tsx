
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { SystemError } from '@/lib/types/error.types';

interface ErrorLogsActionsProps {
  errors: SystemError[];
  isLoading: boolean;
  isClearing: boolean;
  isClearingResolved: boolean;
  onRefresh: () => void;
  onClearAll: () => Promise<void>;
  onClearResolved: () => Promise<void>;
}

export const ErrorLogsActions: React.FC<ErrorLogsActionsProps> = ({
  errors,
  isLoading,
  isClearing,
  isClearingResolved,
  onRefresh,
  onClearAll,
  onClearResolved
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
        Actualizar
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={errors.length === 0 || isLoading || isClearing}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpiar Todo
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Limpiar todos los errores?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los registros de errores.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearAll}
              className="bg-red-500 hover:bg-red-600"
            >
              {isClearing ? 'Limpiando...' : 'Limpiar Todo'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="outline"
        size="sm"
        onClick={onClearResolved}
        disabled={!errors.some(e => e.resolved) || isLoading || isClearingResolved}
      >
        <Check className="h-4 w-4 mr-1" />
        {isClearingResolved ? 'Limpiando...' : 'Limpiar Resueltos'}
      </Button>
    </div>
  );
};
