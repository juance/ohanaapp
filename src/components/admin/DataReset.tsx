
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
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { resetLocalData } from '@/lib/data/syncService';

const DataReset = () => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleResetData = async () => {
    try {
      setIsResetting(true);
      
      // Call the Supabase edge function to reset all data
      const { data, error } = await supabase.functions.invoke('reset_all_data', {
        method: 'POST',
      });
      
      if (error) {
        console.error("Error calling reset_all_data function:", error);
        throw new Error(`Error resetting data: ${error.message}`);
      }
      
      if (!data.success) {
        console.error("Reset function returned error:", data.error);
        throw new Error(`Error from server: ${data.error}`);
      }
      
      // Reset local storage data
      const localResetSuccessful = resetLocalData();
      
      if (!localResetSuccessful) {
        console.warn("Local data reset may have been incomplete");
      }
      
      toast({
        title: "Datos reiniciados",
        description: "Todos los datos han sido reiniciados exitosamente.",
      });
      
      // Close the dialog
      setIsOpen(false);
      
      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      console.error("Error resetting data:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al reiniciar los datos. Intente nuevamente.",
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
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
