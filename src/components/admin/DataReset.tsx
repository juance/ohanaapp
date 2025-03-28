
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DataReset = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    try {
      setIsResetting(true);
      
      // Call the Supabase edge function to reset all data
      const { data, error } = await supabase.functions.invoke('reset_all_data');
      
      if (error) {
        throw error;
      }
      
      // Reset local storage data
      localStorage.removeItem('tickets');
      localStorage.removeItem('expenses');
      
      toast.success("Datos reiniciados", {
        description: "Todos los datos han sido reiniciados exitosamente."
      });
      
      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      console.error("Error resetting data:", err);
      toast.error("Error", {
        description: "Hubo un problema al reiniciar los datos. Intente nuevamente."
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Reiniciar Todos los Datos
        </CardTitle>
        <CardDescription>
          Esta acción eliminará todos los tickets, pedidos, gastos y reiniciará los puntos de fidelidad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">
          Al reiniciar los datos, se eliminará:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
          <li>Todos los tickets generados</li>
          <li>Todas las órdenes para retirar y entregadas</li>
          <li>Todos los datos de administración y métricas</li>
          <li>Todos los puntos de fidelidad de clientes</li>
        </ul>
        <p className="text-sm font-medium text-red-600 mt-4">
          Esta acción no se puede deshacer.
        </p>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar Todos los Datos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente todos los datos de la aplicación y no se puede deshacer.
                Todos los tickets, órdenes y puntos de fidelidad serán eliminados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleResetData}
                disabled={isResetting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isResetting ? "Reiniciando..." : "Sí, reiniciar todo"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DataReset;
