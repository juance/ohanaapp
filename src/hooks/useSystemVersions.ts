
import { useState, useEffect } from 'react';
import { getSystemVersions, setActiveVersion, addSystemVersion, rollbackToVersion } from '@/lib/systemVersionService';
import { toast } from '@/lib/toast';

export interface SystemChange {
  type: 'feature' | 'bugfix' | 'improvement' | 'other';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const data = await getSystemVersions();
      setVersions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching system versions:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching system versions'));
      toast.error('Error al obtener versiones del sistema');
    } finally {
      setLoading(false);
    }
  };

  const activateVersion = async (versionId: string) => {
    try {
      const success = await setActiveVersion(versionId);
      if (success) {
        toast.success('Versión activada correctamente');
        await fetchVersions(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error activating version:', err);
      toast.error('Error al activar versión');
      return false;
    }
  };

  const addVersion = async (version: string, changes: SystemChange[], releaseDate?: Date) => {
    try {
      const success = await addSystemVersion(version, changes, releaseDate);
      if (success) {
        await fetchVersions(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error adding version:', err);
      toast.error('Error al agregar versión');
      return false;
    }
  };

  const rollbackVersion = async (versionId: string) => {
    try {
      const success = await rollbackToVersion(versionId);
      if (success) {
        await fetchVersions(); // Refresh the list
      }
      return success;
    } catch (err) {
      console.error('Error rolling back version:', err);
      toast.error('Error al restaurar versión');
      return false;
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  return {
    versions,
    loading,
    error,
    fetchVersions,
    activateVersion,
    addVersion,
    rollbackVersion
  };
};
