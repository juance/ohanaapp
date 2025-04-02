
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

interface ActionButtonsProps {
  onRefresh: () => Promise<void>;
  onReset?: () => Promise<void>;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onRefresh, 
  onReset 
}) => {
  const [isResetting, setIsResetting] = React.useState(false);
  
  const handleRefresh = async () => {
    toast("Actualizando datos...");
    await onRefresh();
  };
  
  const handleReset = async () => {
    try {
      setIsResetting(true);
      if (onReset) {
        await onReset();
        toast("Datos reiniciados correctamente");
        await onRefresh();
      }
    } catch (err) {
      console.error("Error resetting data:", err);
      toast("Error al reiniciar los datos");
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="flex gap-2">
      {onReset && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              className="flex items-center gap-2"
              disabled={isResetting}
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar Datos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reiniciar datos?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción reiniciará todos los datos a cero. Esta acción no puede deshacerse.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <Button 
        onClick={handleRefresh} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Actualizar Datos
      </Button>
    </div>
  );
};
