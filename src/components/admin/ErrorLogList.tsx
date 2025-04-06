
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SystemError, resolveError, deleteError, clearResolvedErrors } from '@/lib/errorService';
import { toast } from '@/lib/toast';
import { AlertTriangle, CheckCircle, Trash2, RefreshCw } from "lucide-react";

interface ErrorLogListProps {
  errors: SystemError[];
}

export const ErrorLogList: React.FC<ErrorLogListProps> = ({ errors }) => {
  const handleResolveError = (id: string) => {
    if (resolveError(id)) {
      toast({
        title: "Error marcado como resuelto",
        description: "El error ha sido marcado como resuelto correctamente."
      });
    }
  };

  const handleDeleteError = (id: string) => {
    if (deleteError(id)) {
      toast({
        title: "Error eliminado",
        description: "El registro de error ha sido eliminado permanentemente."
      });
    }
  };

  const handleClearResolved = () => {
    const count = clearResolvedErrors();
    if (count > 0) {
      toast({
        title: "Errores resueltos eliminados",
        description: `Se han eliminado ${count} errores resueltos.`
      });
    } else {
      toast({
        title: "No hay errores resueltos",
        description: "No hay errores resueltos para eliminar."
      });
    }
  };

  if (errors.length === 0) {
    return (
      <div className="p-8 text-center">
        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">No hay errores registrados</h3>
        <p className="text-muted-foreground">
          El sistema está funcionando correctamente sin errores registrados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Registro de Errores del Sistema</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearResolved}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Limpiar Resueltos
        </Button>
      </div>

      <div className="space-y-4 mt-4">
        {errors.map((error) => (
          <Card 
            key={error.id} 
            className={`border-l-4 ${error.resolved ? 'border-l-green-500' : 'border-l-red-500'}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${error.resolved ? 'text-green-500' : 'text-red-500'}`} />
                  <div>
                    <p className="font-medium">{error.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(error.timestamp).toLocaleString()}
                    </p>
                    {error.context && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Contexto: {JSON.stringify(error.context)}
                      </p>
                    )}
                    {error.stack && (
                      <details className="mt-2">
                        <summary className="text-sm cursor-pointer hover:text-blue-500">
                          Ver Stack Trace
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                          {error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!error.resolved && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleResolveError(error.id)}
                      className="h-8"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteError(error.id)}
                    className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
