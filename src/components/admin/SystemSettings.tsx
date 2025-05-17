
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { History, FileText, Trash2 } from "lucide-react";
import { SystemVersionInfo } from "./SystemVersionInfo";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const SystemSettings = () => {
  const [isResetting, setIsResetting] = React.useState(false);

  const handleResetAllData = async () => {
    try {
      setIsResetting(true);
      toast({
        title: "Reiniciando datos",
        description: "Este proceso puede tardar un momento..."
      });
      
      const { data, error } = await supabase.functions.invoke("reset_all_data");
      
      if (error) {
        console.error("Error resetting data:", error);
        throw error;
      }
      
      toast({
        title: "Datos reiniciados",
        description: "Todos los datos han sido reiniciados exitosamente"
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error resetting data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al reiniciar los datos"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <History className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle>Control de Versiones</CardTitle>
          </div>
          <CardDescription>
            Historial de cambios del sistema y restauración de versiones anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemVersionInfo />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle>Documentación del Código</CardTitle>
          </div>
          <CardDescription>
            Documentación técnica detallada sobre la estructura y funcionamiento del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Acceda a la documentación técnica completa del sistema para comprender mejor su arquitectura, 
            componentes, servicios y estructura de base de datos.
          </p>
          <Link to="/code-documentation">
            <Button className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Ver Documentación Técnica
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Trash2 className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle>Reinicio de Datos</CardTitle>
          </div>
          <CardDescription>
            Reinicia todos los datos del sistema, incluyendo tickets, clientes y programa de fidelidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-red-500">
            ¡Advertencia! Esta acción eliminará permanentemente todos los tickets, datos de clientes 
            y reiniciará el programa de fidelidad. Esta acción no puede deshacerse.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center">
                <Trash2 className="h-4 w-4 mr-2" />
                Reiniciar Todos los Datos
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente todos los tickets,
                  datos de clientes y programa de fidelidad.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetAllData}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isResetting ? "Procesando..." : "Reiniciar Datos"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
