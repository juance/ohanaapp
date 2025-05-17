
import { useState, useEffect } from 'react';
import { getAllVersions, restoreVersion, syncFromGitHub, GitHubCommit, SystemVersion } from '@/lib/githubService';
import { toast } from '@/lib/toast';

interface VersionWithChanges {
  id: string;
  version: string;
  releaseDate: string;
  isActive: boolean;
  changes: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  commitSha?: string;
  githubUrl?: string;
}

interface UseSystemVersionsReturn {
  versions: VersionWithChanges[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  rollbackVersion: (versionId: string) => Promise<void>;
  syncWithGitHub: () => Promise<void>;
  lastCommit: GitHubCommit | null;
}

export const useSystemVersions = (): UseSystemVersionsReturn => {
  const [versions, setVersions] = useState<VersionWithChanges[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCommit, setLastCommit] = useState<GitHubCommit | null>(null);

  // Función para cargar las versiones
  const fetchVersions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllVersions();
      
      // Convertir al formato que espera el componente
      const formattedVersions = data.map(v => ({
        id: v.id,
        version: v.version,
        releaseDate: v.release_date,
        isActive: v.is_active,
        changes: typeof v.changes === 'string' 
          ? JSON.parse(v.changes)
          : Array.isArray(v.changes) 
            ? v.changes.map(c => typeof c === 'string' ? { type: 'feature', title: c, description: '' } : c)
            : [],
        commitSha: v.commit_sha,
        githubUrl: v.github_url
      }));
      
      setVersions(formattedVersions);
      
      // Cargar último commit de localStorage
      const savedCommit = localStorage.getItem('latestCommit');
      if (savedCommit) {
        setLastCommit(JSON.parse(savedCommit));
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
      setError("No se pudieron cargar las versiones");
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar versiones al montar el componente
  useEffect(() => {
    fetchVersions();
  }, []);
  
  // Función para restaurar una versión
  const rollbackVersion = async (versionId: string) => {
    try {
      await restoreVersion(versionId);
      await fetchVersions();
    } catch (error) {
      console.error("Error rolling back version:", error);
      throw error;
    }
  };
  
  // Función para sincronizar con GitHub
  const syncWithGitHub = async () => {
    try {
      const result = await syncFromGitHub();
      
      if (result.success) {
        toast.success(result.message);
        if (result.latestCommit) {
          setLastCommit(result.latestCommit);
        }
        await fetchVersions();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error syncing with GitHub:", error);
      toast.error("Error al sincronizar con GitHub");
    }
  };
  
  return {
    versions,
    loading,
    error,
    refetch: fetchVersions,
    rollbackVersion,
    syncWithGitHub,
    lastCommit
  };
};
