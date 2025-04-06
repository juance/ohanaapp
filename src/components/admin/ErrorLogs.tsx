
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";
import { getErrors, clearErrors } from '@/lib/errorService';

export const ErrorLogs = () => {
  const [errors, setErrors] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = () => {
    setIsLoading(true);
    try {
      const systemErrors = getErrors();
      setErrors(systemErrors);
    } catch (error) {
      console.error("Error loading error logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los registros de errores."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearErrors = () => {
    try {
      clearErrors();
      setErrors([]);
      toast({
        title: "Registros limpiados",
        description: "Los registros de errores han sido limpiados exitosamente."
      });
    } catch (error) {
      console.error("Error clearing error logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron limpiar los registros de errores."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <CardTitle>Registro de Errores</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadErrors}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearErrors}
              disabled={errors.length === 0 || isLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          </div>
        </div>
        <CardDescription>
          Registro de errores del sistema para ayudar en la resolución de problemas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : errors.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {errors.map((error, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium text-red-800">{error.message || "Error desconocido"}</h3>
                    <p className="text-xs text-red-600 mt-1">
                      {new Date(error.timestamp || Date.now()).toLocaleString()}
                    </p>
                    {error.stack && (
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                        {error.stack}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay errores registrados en el sistema.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
