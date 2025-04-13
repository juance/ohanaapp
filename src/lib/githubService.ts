import { supabase } from '@/integrations/supabase/client';

// Definición de tipos
export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export interface SystemVersion {
  id: string;
  version: string;
  release_date: string;
  is_active: boolean;
  changes: string[];
  commit_sha?: string;
  github_url?: string;
}

// Configuración del repositorio
const REPO_OWNER = 'juance';
const REPO_NAME = 'ohanaapp';
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Obtiene los últimos commits del repositorio
 * @param limit Número máximo de commits a obtener
 */
export const getLatestCommits = async (limit: number = 10): Promise<GitHubCommit[]> => {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener commits: ${response.statusText}`);
    }

    const commits = await response.json();
    return commits;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
};

/**
 * Crea una nueva versión del sistema basada en un commit de GitHub
 * @param version Número de versión (ej: "1.2.3")
 * @param commitSha SHA del commit en GitHub
 * @param changes Lista de cambios en esta versión
 */
export const createVersionFromCommit = async (
  version: string,
  commitSha: string,
  changes: string[]
): Promise<SystemVersion> => {
  try {
    // Obtener detalles del commit
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits/${commitSha}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener detalles del commit: ${response.statusText}`);
    }

    const commitData = await response.json();
    
    // Desactivar todas las versiones actuales
    await supabase
      .from('system_version')
      .update({ is_active: false })
      .eq('is_active', true);
    
    // Crear nueva versión
    const { data, error } = await supabase
      .from('system_version')
      .insert({
        version,
        release_date: new Date().toISOString(),
        is_active: true,
        changes,
        commit_sha: commitSha,
        github_url: commitData.html_url
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as SystemVersion;
  } catch (error) {
    console.error('Error creating version from commit:', error);
    throw error;
  }
};

/**
 * Restaura el sistema a una versión anterior
 * @param versionId ID de la versión a restaurar
 */
export const restoreVersion = async (versionId: string): Promise<SystemVersion> => {
  try {
    // Obtener la versión a restaurar
    const { data: versionToRestore, error: fetchError } = await supabase
      .from('system_version')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (fetchError || !versionToRestore) {
      throw fetchError || new Error('Versión no encontrada');
    }
    
    // Desactivar todas las versiones
    await supabase
      .from('system_version')
      .update({ is_active: false });
    
    // Activar la versión seleccionada
    const { data, error } = await supabase
      .from('system_version')
      .update({ is_active: true })
      .eq('id', versionId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as SystemVersion;
  } catch (error) {
    console.error('Error restoring version:', error);
    throw error;
  }
};

/**
 * Obtiene todas las versiones del sistema
 */
export const getAllVersions = async (): Promise<SystemVersion[]> => {
  try {
    const { data, error } = await supabase
      .from('system_version')
      .select('*')
      .order('release_date', { ascending: false });
    
    if (error) throw error;
    
    // Convertir de JSON a array si es necesario
    const formattedVersions = (data || []).map(version => ({
      ...version,
      changes: Array.isArray(version.changes) ? version.changes : 
               typeof version.changes === 'string' ? JSON.parse(version.changes) : 
               []
    }));
    
    return formattedVersions as SystemVersion[];
  } catch (error) {
    console.error('Error fetching system versions:', error);
    throw error;
  }
};
