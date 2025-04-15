
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { AlertTriangle, RefreshCw, Trash2, Check, X, User, Monitor, Code, ExternalLink } from "lucide-react";
import { getErrors, clearErrors, resolveError, deleteError, clearResolvedErrors, SystemError } from '@/lib/errorService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ErrorLogs = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isClearing, setIsClearing] = useState(false);
  const [isClearingResolved, setIsClearingResolved] = useState(false);

  useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = async () => {
    setIsLoading(true);
    try {
      const systemErrors = await getErrors();
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

  const handleClearErrors = async () => {
    setIsClearing(true);
    try {
      await clearErrors();
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
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearResolvedErrors = async () => {
    setIsClearingResolved(true);
    try {
      await clearResolvedErrors();
      loadErrors(); // Recargar errores
      toast({
        title: "Registros resueltos limpiados",
        description: "Se han eliminado los registros de errores resueltos."
      });
    } catch (error) {
      console.error("Error clearing resolved error logs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron limpiar los registros de errores resueltos."
      });
    } finally {
      setIsClearingResolved(false);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      await resolveError(errorId);
      // Actualizar el estado local
      setErrors(errors.map(error =>
        error.id === errorId ? { ...error, resolved: true } : error
      ));
      toast({
        title: "Error resuelto",
        description: "El error ha sido marcado como resuelto."
      });
    } catch (error) {
      console.error("Error resolving error log:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo marcar el error como resuelto."
      });
    }
  };

  const handleDeleteError = async (errorId: string) => {
    try {
      await deleteError(errorId);
      // Actualizar el estado local
      setErrors(errors.filter(error => error.id !== errorId));
      toast({
        title: "Error eliminado",
        description: "El error ha sido eliminado correctamente."
      });
    } catch (error) {
      console.error("Error deleting error log:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el error."
      });
    }
  };

  // Filtrar errores según la pestaña activa
  const filteredErrors = activeTab === 'all'
    ? errors
    : activeTab === 'resolved'
      ? errors.filter(error => error.resolved)
      : errors.filter(error => !error.resolved);

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
                    onClick={handleClearErrors}
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
              onClick={handleClearResolvedErrors}
              disabled={!errors.some(e => e.resolved) || isLoading || isClearingResolved}
            >
              <Check className="h-4 w-4 mr-1" />
              {isClearingResolved ? 'Limpiando...' : 'Limpiar Resueltos'}
            </Button>
          </div>
        </div>
        <CardDescription>
          Registro de errores del sistema para ayudar en la resolución de problemas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Todos ({errors.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activos ({errors.filter(e => !e.resolved).length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resueltos ({errors.filter(e => e.resolved).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredErrors.length > 0 ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredErrors.map((error) => (
              <div
                key={error.id}
                className={`border rounded-md p-3 ${error.resolved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
              >
                <div className="flex items-start">
                  {error.resolved ? (
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${error.resolved ? 'text-green-800' : 'text-red-800'}`}>
                        {error.message || error.error_message || "Error desconocido"}
                      </h3>
                      <div className="flex space-x-1">
                        {error.component && (
                          <Badge variant="outline" className="text-xs">
                            <Code className="h-3 w-3 mr-1" />
                            {error.component}
                          </Badge>
                        )}
                        {error.user_id && (
                          <Badge variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            Usuario
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(error.timestamp).toLocaleString()}
                    </p>

                    {error.error_stack && (
                      <pre className={`mt-2 text-xs p-2 rounded overflow-x-auto ${error.resolved ? 'bg-green-100' : 'bg-red-100'}`}>
                        {error.error_stack}
                      </pre>
                    )}

                    {error.browser_info && (
                      <div className="mt-2 text-xs text-gray-600">
                        <details>
                          <summary className="cursor-pointer hover:text-gray-800">Información del navegador</summary>
                          <div className="p-2 mt-1 bg-gray-50 rounded">
                            {typeof error.browser_info === 'object' && (
                              <pre>{JSON.stringify(error.browser_info, null, 2)}</pre>
                            )}
                          </div>
                        </details>
                      </div>
                    )}

                    <div className="mt-3 flex justify-end space-x-2">
                      {!error.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveError(error.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Marcar como resuelto
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este error?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente este registro de error.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteError(error.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {activeTab === 'all'
              ? 'No hay errores registrados en el sistema.'
              : activeTab === 'resolved'
                ? 'No hay errores resueltos.'
                : 'No hay errores activos.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
