
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, History } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

// Definición de las versiones del sistema
const systemVersions = [
  {
    version: "1.3.0",
    date: "2023-10-15",
    description: "Versión actual",
    changes: [
      "Implementación de sistema de métricas avanzadas",
      "Nueva funcionalidad para reiniciar valores de métricas",
      "Visualización mejorada de datos en el panel de control",
      "Corrección de errores menores en la interfaz de usuario"
    ]
  },
  {
    version: "1.2.0",
    date: "2023-08-20",
    description: "Actualización de verano",
    changes: [
      "Integración con sistema de pagos",
      "Nuevo módulo de gestión de inventario",
      "Mejoras en la velocidad de carga de datos",
      "Optimización de consultas a la base de datos"
    ]
  },
  {
    version: "1.1.5",
    date: "2023-06-10",
    description: "Parche de seguridad",
    changes: [
      "Mejora de seguridad en autenticación",
      "Corrección de errores críticos",
      "Actualización de dependencias",
      "Optimización de rendimiento"
    ]
  },
  {
    version: "1.1.0",
    date: "2023-04-15",
    description: "Primera actualización",
    changes: [
      "Implementación de sistema de clientes frecuentes",
      "Nueva interfaz para gestión de tickets",
      "Módulo de estadísticas básicas",
      "Mejoras en la interfaz de usuario"
    ]
  },
  {
    version: "1.0.0",
    date: "2023-02-01",
    description: "Versión inicial",
    changes: [
      "Lanzamiento inicial del sistema",
      "Funcionalidades básicas de lavandería",
      "Gestión de tickets",
      "Panel de administración básico"
    ]
  }
];

const VersionHistory = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>("1.3.0");
  const [isReverting, setIsReverting] = useState(false);
  
  const handleRevertToVersion = async (version: string) => {
    try {
      setIsReverting(true);
      
      // Simular un proceso de reversión
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Sistema revertido", {
        description: `Versión ${version} restaurada correctamente.`
      });
      
      // En una implementación real, aquí se realizaría la restauración del sistema
      
    } catch (err) {
      console.error("Error al revertir a versión:", err);
      toast.error("Error", {
        description: "No se pudo revertir a la versión seleccionada."
      });
    } finally {
      setIsReverting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Versiones
        </CardTitle>
        <CardDescription>
          Historial de cambios del sistema y opción para restaurar versiones anteriores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label htmlFor="version-select" className="text-sm font-medium block mb-2">
            Seleccionar versión
          </label>
          <Select 
            value={selectedVersion} 
            onValueChange={setSelectedVersion}
          >
            <SelectTrigger id="version-select" className="w-full">
              <SelectValue placeholder="Seleccionar versión" />
            </SelectTrigger>
            <SelectContent>
              {systemVersions.map((v) => (
                <SelectItem key={v.version} value={v.version}>
                  v{v.version} - {v.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="mt-2 text-sm text-muted-foreground">
            Seleccione una versión para ver detalles o restaurar el sistema
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {systemVersions.map((version) => (
            <AccordionItem key={version.version} value={version.version}>
              <AccordionTrigger className="text-left">
                <div>
                  <div className="font-medium">v{version.version} - {version.description}</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {version.date}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
                  <h4 className="text-sm font-medium mb-2">Cambios:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index}>{change}</li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={selectedVersion === "1.3.0"}
            >
              Restaurar a v{selectedVersion}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restaurar sistema a v{selectedVersion}?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción restaurará el sistema a una versión anterior ({selectedVersion}).
                Algunos datos y funcionalidades podrían no ser compatibles con la versión seleccionada.
                Se recomienda hacer una copia de seguridad antes de continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleRevertToVersion(selectedVersion)}
                disabled={isReverting}
              >
                {isReverting ? "Restaurando..." : "Confirmar restauración"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default VersionHistory;
