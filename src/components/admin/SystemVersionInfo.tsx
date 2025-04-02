
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type VersionChange = {
  description: string;
  date: string;
};

type VersionInfo = {
  version: string;
  changes: VersionChange[];
};

// Historial de versiones con los cambios realizados
const versionHistory: VersionInfo[] = [
  {
    version: '1.0.0',
    changes: [
      { description: 'Versión inicial del sistema', date: '01/04/2023' },
      { description: 'Implementación del sistema de tickets', date: '01/04/2023' },
      { description: 'Gestión básica de clientes', date: '01/04/2023' }
    ]
  },
  {
    version: '1.1.0',
    changes: [
      { description: 'Añadido sistema de análisis de datos', date: '15/05/2023' },
      { description: 'Mejoras en la interfaz de usuario', date: '15/05/2023' }
    ]
  },
  {
    version: '1.2.0',
    changes: [
      { description: 'Implementación del programa de fidelidad', date: '10/07/2023' },
      { description: 'Sistema de gestión de inventario', date: '10/07/2023' }
    ]
  },
  {
    version: '1.3.0',
    changes: [
      { description: 'Integración con base de datos Supabase', date: '20/08/2023' },
      { description: 'Funcionamiento offline mejorado', date: '20/08/2023' }
    ]
  },
  {
    version: '1.4.0',
    changes: [
      { description: 'Mejoras en el rendimiento general', date: '05/10/2023' },
      { description: 'Sistema de informes avanzados', date: '05/10/2023' }
    ]
  },
  {
    version: '1.5.0',
    changes: [
      { description: 'Mejoras en la visualización de métricas', date: '15/12/2023' },
      { description: 'Sistema de notificaciones para clientes', date: '15/12/2023' }
    ]
  },
  {
    version: '2.0.0',
    changes: [
      { description: 'Rediseño completo de la interfaz', date: '20/02/2024' },
      { description: 'Optimización para dispositivos móviles', date: '20/02/2024' },
      { description: 'Nuevo panel de administración', date: '20/02/2024' }
    ]
  },
  {
    version: '2.1.0',
    changes: [
      { description: 'Mejoras en el sistema de métricas', date: '10/05/2024' },
      { description: 'Selector de fechas manual en métricas y análisis', date: '15/06/2024' },
      { description: 'Historial detallado de versiones', date: '15/06/2024' }
    ]
  }
];

// Obtener la versión actual (la última del historial)
const currentVersion = versionHistory[versionHistory.length - 1].version;

export const SystemVersionInfo: React.FC = () => {
  const [isRollingBack, setIsRollingBack] = useState(false);

  const handleRollbackToVersion = (version: string) => {
    setIsRollingBack(true);
    
    // Simulación de rollback (aquí se implementaría la lógica real de rollback)
    setTimeout(() => {
      setIsRollingBack(false);
      toast(`Sistema restaurado a la versión ${version}`);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles técnicos y versión</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1" disabled={isRollingBack}>
                {isRollingBack ? "Restaurando..." : "Restaurar versión"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {versionHistory.slice().reverse().map((version) => (
                <DropdownMenuItem
                  key={version.version}
                  disabled={version.version === currentVersion}
                  onClick={() => handleRollbackToVersion(version.version)}
                  className="cursor-pointer"
                >
                  Versión {version.version}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-sm font-medium">Versión Actual</h3>
          <p className="text-sm text-muted-foreground">{currentVersion}</p>
        </div>
        <div className="flex flex-col space-y-1.5">
          <h3 className="text-sm font-medium">Base de Datos</h3>
          <p className="text-sm text-muted-foreground">Supabase PostgreSQL</p>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Historial de Cambios</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versión</TableHead>
                <TableHead>Cambios</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionHistory.slice().reverse().flatMap((version) => 
                version.changes.map((change, index) => (
                  <TableRow key={`${version.version}-${index}`}>
                    {index === 0 ? (
                      <TableCell rowSpan={version.changes.length} className="font-medium">
                        {version.version}
                      </TableCell>
                    ) : null}
                    <TableCell>{change.description}</TableCell>
                    <TableCell>{change.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
