import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, RotateCcw, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { toast } from "@/lib/toast";
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
import { useSystemVersions } from '@/hooks/useSystemVersions';
import { GitHubSyncButton } from './GitHubSyncButton';

export const SystemVersions = () => {
  const { 
    versions, 
    loading, 
    rollbackVersion 
  } = useSystemVersions();
  
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  
  // Get the current version (active one)
  const currentVersion = versions.find(v => v.isActive)?.version || '';

  const handleRollback = async () => {
    if (!selectedVersion) return;
    
    setIsRollingBack(true);
    try {
      await rollbackVersion(selectedVersion);
      toast({
        title: "Sistema restaurado correctamente",
        description: `Se ha vuelto a la versión ${selectedVersion}`
      });
      
      // Reload the page after a short delay to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error al restaurar versión:", error);
      toast({
        title: "Error al restaurar versión",
        description: "No se pudo volver a la versión seleccionada"
      });
    } finally {
      setIsRollingBack(false);
    }
  };

  const getVersionBadge = (version: string) => {
    if (version === currentVersion) {
      return (
        <Badge variant="default" className="ml-2 bg-green-500">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Actual
        </Badge>
      );
    }
    return null;
  };

  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case 'feature':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nueva función</Badge>;
      case 'fix':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Corrección</Badge>;
      case 'improvement':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Mejora</Badge>;
      case 'security':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Seguridad</Badge>;
      default:
        return <Badge variant="outline">Cambio</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Control de Versiones
        </CardTitle>
        <CardDescription>
          Historial de cambios del sistema y restauración de versiones anteriores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4 space-x-2">
          <GitHubSyncButton onSyncCompleted={() => {
            // Refresh versions after sync
            if (typeof loading === 'boolean' && typeof versions === 'object') {
              // This assumes there is a loadVersions function in the useSystemVersions hook
              // If not, you may need to adjust this
              const { refetch } = useSystemVersions();
              if (typeof refetch === 'function') {
                refetch();
              }
            }
          }} />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span className="ml-2">Cargando versiones...</span>
          </div>
        ) : versions.length === 0 ? (
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Info className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-800">No hay historial de versiones disponible.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Versión</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cambios</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow 
                    key={version.id}
                    className={version.version === currentVersion ? "bg-blue-50" : ""}
                  >
                    <TableCell className="font-medium">
                      {version.version}
                      {getVersionBadge(version.version)}
                    </TableCell>
                    <TableCell>
                      {new Date(version.releaseDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {version.changes.map((change, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              {getChangeTypeBadge(change.type)}
                              <span className="text-sm font-medium">{change.title}</span>
                            </div>
                            <p className="text-xs text-gray-500">{change.description}</p>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {version.version !== currentVersion && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedVersion(version.version)}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />
                              Restaurar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Restaurar versión {version.version}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción restaurará el sistema a la versión {version.version}. 
                                Todos los cambios realizados después de esta versión se perderán.
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                                  <span className="text-amber-800 text-sm">
                                    Asegúrese de que no hay operaciones en curso antes de continuar.
                                    Se recomienda hacer una copia de seguridad de los datos.
                                  </span>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleRollback}
                                disabled={isRollingBack}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {isRollingBack ? (
                                  <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                                    Restaurando...
                                  </>
                                ) : (
                                  "Confirmar Restauración"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          Versión actual: <span className="font-semibold">{currentVersion}</span>
        </p>
        <p className="text-xs text-gray-500">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>
      </CardFooter>
    </Card>
  );
};
