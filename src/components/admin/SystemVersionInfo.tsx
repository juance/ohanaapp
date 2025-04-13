
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Download, RefreshCw, GitBranch, GitCommit, Plus, RotateCcw, ExternalLink } from "lucide-react";
import { getAllVersions, getLatestCommits, createVersionFromCommit, restoreVersion, GitHubCommit, SystemVersion } from "@/lib/githubService";

interface VersionFormData {
  version: string;
  changes: string;
  commitSha: string;
}

export const SystemVersionInfo = () => {
  const [versions, setVersions] = useState<SystemVersion[]>([]);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommitsLoading, setIsCommitsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [formData, setFormData] = useState<VersionFormData>({
    version: '',
    changes: '',
    commitSha: ''
  });

  useEffect(() => {
    loadVersions();
    loadLatestCommits();
  }, []);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const data = await getAllVersions();
      setVersions(data);
    } catch (error) {
      console.error("Error loading system versions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las versiones del sistema."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadLatestCommits = async () => {
    setIsCommitsLoading(true);
    try {
      const data = await getLatestCommits(10);
      setCommits(data);
    } catch (error) {
      console.error("Error loading GitHub commits:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los commits de GitHub."
      });
    } finally {
      setIsCommitsLoading(false);
    }
  };

  const handleCreateVersion = async () => {
    try {
      if (!formData.version || !formData.commitSha || !formData.changes) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Todos los campos son obligatorios."
        });
        return;
      }

      // Convertir los cambios de texto a array
      const changesArray = formData.changes
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      await createVersionFromCommit(
        formData.version,
        formData.commitSha,
        changesArray
      );

      toast({
        title: "Versión creada",
        description: `La versión ${formData.version} ha sido creada correctamente.`
      });

      // Cerrar diálogo y recargar versiones
      setIsDialogOpen(false);
      loadVersions();

      // Resetear formulario
      setFormData({
        version: '',
        changes: '',
        commitSha: ''
      });
    } catch (error) {
      console.error("Error creating version:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la versión."
      });
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    setIsRestoring(true);
    try {
      await restoreVersion(versionId);
      toast({
        title: "Versión restaurada",
        description: "El sistema ha sido restaurado a la versión seleccionada."
      });
      loadVersions();
    } catch (error) {
      console.error("Error restoring version:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo restaurar la versión."
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleCommitSelect = (commit: GitHubCommit) => {
    // Extraer el número de versión del mensaje de commit si sigue el formato "v1.2.3: mensaje"
    const versionMatch = commit.commit.message.match(/^v(\d+\.\d+\.\d+):/i);
    const version = versionMatch ? versionMatch[1] : '';

    // Extraer el mensaje sin el prefijo de versión
    const message = versionMatch
      ? commit.commit.message.substring(commit.commit.message.indexOf(':') + 1).trim()
      : commit.commit.message;

    setFormData({
      version: version || '',
      commitSha: commit.sha,
      changes: message
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Versiones del sistema</h3>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nueva Versión
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva versión</DialogTitle>
                <DialogDescription>
                  Crea una nueva versión del sistema basada en un commit de GitHub.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Número de versión</Label>
                  <Input
                    id="version"
                    placeholder="1.0.0"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commitSha">Commit SHA</Label>
                  <Input
                    id="commitSha"
                    placeholder="Selecciona un commit abajo"
                    value={formData.commitSha}
                    onChange={(e) => setFormData({...formData, commitSha: e.target.value})}
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="changes">Cambios (uno por línea)</Label>
                  <Textarea
                    id="changes"
                    placeholder="- Corregido error en...
- Mejorado rendimiento de...
- Agregada funcionalidad de..."
                    value={formData.changes}
                    onChange={(e) => setFormData({...formData, changes: e.target.value})}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Commits recientes</Label>
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {isCommitsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    ) : commits.length > 0 ? (
                      <div className="divide-y">
                        {commits.map((commit) => (
                          <div
                            key={commit.sha}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${formData.commitSha === commit.sha ? 'bg-blue-50' : ''}`}
                            onClick={() => handleCommitSelect(commit)}
                          >
                            <div className="flex items-start">
                              <GitCommit className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{commit.commit.message}</p>
                                <p className="text-xs text-gray-500">
                                  {commit.sha.substring(0, 7)} • {new Date(commit.commit.author.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No se pudieron cargar los commits.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateVersion}>Crear Versión</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadVersions();
              loadLatestCommits();
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : versions.length > 0 ? (
        <div className="space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`border rounded-md p-4 ${version.is_active ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Versión {version.version}</h3>
                  <p className="text-xs text-muted-foreground">
                    Fecha: {new Date(version.release_date).toLocaleDateString()}
                  </p>
                </div>
                {version.is_active && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Actual</span>
                )}
              </div>

              {version.changes && version.changes.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Cambios:</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {version.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 flex justify-end space-x-2">
                {version.github_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(version.github_url, '_blank')}
                  >
                    <GitBranch className="h-4 w-4 mr-1" />
                    Ver en GitHub
                  </Button>
                )}

                {!version.is_active && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restaurar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Restaurar versión?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de restaurar el sistema a la versión {version.version}.
                          Esta acción no afectará a los datos, solo a la versión activa del sistema.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRestoreVersion(version.id)}
                          disabled={isRestoring}
                        >
                          {isRestoring ? 'Restaurando...' : 'Restaurar'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No hay información de versiones disponible.
          <div className="mt-4">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Crear primera versión
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
