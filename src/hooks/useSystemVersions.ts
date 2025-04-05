import { useState, useEffect } from 'react';
import { toast } from '@/lib/toast';
import { getSystemVersions, getCurrentVersion, rollbackToVersion as rollbackService } from '@/lib/systemVersionService';

export interface SystemChange {
  type: 'feature' | 'fix' | 'improvement' | 'security' | 'other';
  title: string;
  description: string;
}

export interface SystemVersion {
  id: string;
  version: string;
  releaseDate: string;
  changes: SystemChange[];
  isActive: boolean;
}

export const useSystemVersions = () => {
  const [versions, setVersions] = useState<SystemVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>('1.0.0');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      // Get versions from service
      const versionsData = await getSystemVersions();

      if (versionsData && versionsData.length > 0) {
        setVersions(versionsData);

        // Set current version
        const activeVersion = versionsData.find(v => v.isActive);
        if (activeVersion) {
          setCurrentVersion(activeVersion.version);
        } else {
          // If no active version found, try to get it separately
          const current = await getCurrentVersion();
          if (current) {
            setCurrentVersion(current.version);
          }
        }
      } else {
        // If no data, use mock data
        setVersions(getMockVersions());
        setCurrentVersion('1.0.0');
      }
    } catch (error) {
      console.error('Error fetching system versions:', error);
      // Fallback to mock data
      setVersions(getMockVersions());
      setCurrentVersion('1.0.0');
    } finally {
      setIsLoading(false);
    }
  };

  const rollbackToVersion = async (version: string): Promise<boolean> => {
    try {
      // First, check if the version exists
      const targetVersion = versions.find(v => v.version === version);
      if (!targetVersion) {
        throw new Error('Versión no encontrada');
      }

      // Call the service to perform the rollback
      const success = await rollbackService(targetVersion.id);

      if (success) {
        // Update current version in state
        setCurrentVersion(version);

        // Update versions to mark the selected one as active
        setVersions(prevVersions =>
          prevVersions.map(v => ({
            ...v,
            isActive: v.version === version
          }))
        );
      }

      return success;
    } catch (error) {
      console.error('Error rolling back to version:', error);
      toast.error('Error al restaurar versión');
      return false;
    }
  };

  return {
    versions,
    currentVersion,
    isLoading,
    rollbackToVersion
  };
};

// Mock data for development and testing
const getMockVersions = (): SystemVersion[] => [
  {
    id: '1',
    version: '1.0.0',
    releaseDate: '2023-10-15T00:00:00Z',
    changes: [
      {
        type: 'feature',
        title: 'Lanzamiento inicial',
        description: 'Primera versión del sistema de gestión de lavandería'
      },
      {
        type: 'feature',
        title: 'Sistema de tickets',
        description: 'Implementación del sistema básico de tickets'
      },
      {
        type: 'feature',
        title: 'Gestión de clientes',
        description: 'Funcionalidad para administrar clientes'
      }
    ],
    isActive: true
  },
  {
    id: '2',
    version: '1.1.0',
    releaseDate: '2023-11-20T00:00:00Z',
    changes: [
      {
        type: 'feature',
        title: 'Programa de fidelidad',
        description: 'Implementación del sistema de puntos de fidelidad para clientes frecuentes'
      },
      {
        type: 'improvement',
        title: 'Mejora en la interfaz de usuario',
        description: 'Rediseño de la interfaz para mejorar la experiencia de usuario'
      },
      {
        type: 'fix',
        title: 'Corrección de errores en tickets',
        description: 'Solución a problemas con la numeración de tickets'
      }
    ],
    isActive: false
  },
  {
    id: '3',
    version: '1.2.0',
    releaseDate: '2024-01-10T00:00:00Z',
    changes: [
      {
        type: 'feature',
        title: 'Gestión de inventario',
        description: 'Nueva funcionalidad para administrar el inventario de productos'
      },
      {
        type: 'security',
        title: 'Mejoras de seguridad',
        description: 'Implementación de medidas de seguridad adicionales'
      }
    ],
    isActive: false
  },
  {
    id: '4',
    version: '1.3.0',
    releaseDate: '2024-03-05T00:00:00Z',
    changes: [
      {
        type: 'feature',
        title: 'Notificaciones por WhatsApp',
        description: 'Integración con WhatsApp para enviar notificaciones a clientes'
      },
      {
        type: 'improvement',
        title: 'Optimización de rendimiento',
        description: 'Mejoras en la velocidad y rendimiento general de la aplicación'
      }
    ],
    isActive: false
  },
  {
    id: '5',
    version: '1.4.0',
    releaseDate: '2024-05-20T00:00:00Z',
    changes: [
      {
        type: 'feature',
        title: 'Alertas de tickets no retirados',
        description: 'Sistema de alertas para tickets que no han sido retirados después de 45 y 90 días'
      },
      {
        type: 'improvement',
        title: 'Mejoras en el panel de administración',
        description: 'Nuevas funcionalidades en el panel de administración'
      },
      {
        type: 'feature',
        title: 'Control de versiones',
        description: 'Implementación del sistema de control de versiones con capacidad de rollback'
      }
    ],
    isActive: false
  }
];
