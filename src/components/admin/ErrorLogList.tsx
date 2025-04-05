
import React, { useState } from 'react';
import { getErrors, resolveError, deleteError, clearResolvedErrors, SystemError } from '@/lib/errorService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/lib/toast';
import { Loader2, CheckCircle, Trash2, AlertTriangle, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ErrorLogList() {
  const [errors, setErrors] = useState<SystemError[]>(getErrors());
  const [showResolved, setShowResolved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshErrors = () => {
    setIsRefreshing(true);
    // Simular una breve demora para dar feedback visual
    setTimeout(() => {
      setErrors(getErrors());
      setIsRefreshing(false);
    }, 300);
  };

  const handleResolveError = (errorId: string) => {
    if (resolveError(errorId)) {
      toast({
        title: "Error resuelto",
        description: "El error ha sido marcado como resuelto."
      });
      refreshErrors();
    }
  };

  const handleDeleteError = (errorId: string) => {
    if (deleteError(errorId)) {
      toast({
        title: "Error eliminado",
        description: "El error ha sido eliminado del registro."
      });
      refreshErrors();
    }
  };

  const handleClearResolved = () => {
    const clearedCount = clearResolvedErrors();
    toast({
      title: "Limpieza completada",
      description: `Se eliminaron ${clearedCount} errores resueltos.`
    });
    refreshErrors();
  };

  const filteredErrors = showResolved
    ? errors
    : errors.filter(error => !error.resolved);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Registro de Errores del Sistema</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResolved(!showResolved)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showResolved ? "Ocultar resueltos" : "Mostrar todos"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={refreshErrors}
              disabled={isRefreshing}
            >
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar"}
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Monitorea y gestiona los errores detectados en la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredErrors.length === 0 ? (
          <Alert>
            <AlertTitle>No hay errores para mostrar</AlertTitle>
            <AlertDescription>
              {showResolved
                ? "No se han registrado errores en el sistema."
                : "No hay errores pendientes. Puedes mostrar los errores resueltos con el filtro."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredErrors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>
                      {error.resolved ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Resuelto
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(error.timestamp)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <div className="font-medium">{error.message}</div>
                      {error.context && (
                        <div className="text-xs text-gray-500 mt-1">
                          {error.context.type && (
                            <span className="mr-2">Tipo: {error.context.type}</span>
                          )}
                          {error.context.location && (
                            <span>Ubicación: {error.context.location}</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!error.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolveError(error.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolver
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteError(error.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredErrors.length} {filteredErrors.length === 1 ? 'error' : 'errores'} {showResolved ? '' : 'pendientes'}
        </div>
        {errors.some(e => e.resolved) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearResolved}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar resueltos
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
