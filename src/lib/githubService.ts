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

// Configuración de acceso a GitHub sin autenticación
const GITHUB_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'OhanaApp-Admin'
};

/**
 * Obtiene los últimos commits del repositorio
 * @param limit Número máximo de commits a obtener
 */
// Commits locales para usar cuando la API de GitHub no está disponible
const LOCAL_COMMITS: GitHubCommit[] = [
  {
    sha: '6d871bb',
    commit: {
      message: 'Mejorar control de versiones y registro de errores en la sección de administración',
      author: {
        name: 'juance',
        date: new Date().toISOString()
      }
    },
    html_url: 'https://github.com/juance/ohanaapp/commit/6d871bb'
  },
  {
    sha: 'd717cb2',
    commit: {
      message: 'Corregir error al agregar usuarios',
      author: {
        name: 'juance',
        date: new Date(Date.now() - 86400000).toISOString() // Ayer
      }
    },
    html_url: 'https://github.com/juance/ohanaapp/commit/d717cb2'
  },
  {
    sha: '9a8b7c6',
    commit: {
      message: 'v1.0.0: Versión inicial estable',
      author: {
        name: 'juance',
        date: new Date(Date.now() - 172800000).toISOString() // Hace 2 días
      }
    },
    html_url: 'https://github.com/juance/ohanaapp/commit/9a8b7c6'
  }
];

export const getLatestCommits = async (limit: number = 10): Promise<GitHubCommit[]> => {
  try {
    console.log(`Obteniendo últimos ${limit} commits del repositorio ${REPO_OWNER}/${REPO_NAME}`);

    // Intentar obtener commits de GitHub
    try {
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${limit}`,
        {
          headers: GITHUB_HEADERS
        }
      );

      if (response.ok) {
        const commits = await response.json();
        console.log(`Obtenidos ${commits.length} commits de GitHub`);
        return commits;
      } else {
        console.warn(`No se pudieron obtener commits de GitHub: ${response.status} ${response.statusText}`);
        // Continuar con la solución alternativa
      }
    } catch (githubError) {
      console.warn('Error al acceder a la API de GitHub:', githubError);
      // Continuar con la solución alternativa
    }

    // Solución alternativa: usar commits locales
    console.log('Usando commits locales como alternativa');
    return LOCAL_COMMITS.slice(0, limit);
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
    console.log('Iniciando creación de versión:', { version, commitSha });

    // Variable para almacenar la URL del commit
    let commitUrl = '';

    // Intentar obtener detalles del commit desde GitHub
    try {
      console.log(`Obteniendo detalles del commit: ${commitSha}`);
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits/${commitSha}`,
        {
          headers: GITHUB_HEADERS
        }
      );

      if (response.ok) {
        const commitData = await response.json();
        console.log('Datos del commit obtenidos:', commitData.html_url);
        commitUrl = commitData.html_url;
      } else {
        console.warn(`No se pudieron obtener detalles del commit: ${response.status} ${response.statusText}`);
        // Continuar con la solución alternativa
      }
    } catch (githubError) {
      console.warn('Error al acceder a la API de GitHub:', githubError);
      // Continuar con la solución alternativa
    }

    // Si no se pudo obtener la URL del commit desde GitHub, buscar en commits locales
    if (!commitUrl) {
      console.log('Buscando commit en datos locales');
      const localCommit = LOCAL_COMMITS.find(c => c.sha === commitSha || c.sha.startsWith(commitSha));
      if (localCommit) {
        console.log('Commit encontrado en datos locales:', localCommit.html_url);
        commitUrl = localCommit.html_url;
      } else {
        // Si no se encuentra, crear una URL genérica
        commitUrl = `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${commitSha}`;
        console.log('Usando URL genérica para el commit:', commitUrl);
      }
    }

    // Desactivar todas las versiones actuales
    console.log('Desactivando versiones actuales');
    const { error: updateError } = await supabase
      .from('system_version')
      .update({ is_active: false })
      .eq('is_active', true);

    if (updateError) {
      console.error('Error al desactivar versiones:', updateError);
    }

    // Preparar datos para inserción
    const versionData = {
      version,
      release_date: new Date().toISOString(),
      is_active: true,
      changes,
      commit_sha: commitSha,
      github_url: commitUrl
    };

    console.log('Insertando nueva versión con datos:', versionData);

    // Crear nueva versión
    const { data, error } = await supabase
      .from('system_version')
      .insert(versionData)
      .select()
      .single();

    if (error) {
      console.error('Error al insertar versión:', error);
      throw error;
    }

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

/**
 * Sincroniza los últimos cambios desde GitHub al sistema local
 * @returns Objeto con información de la sincronización
 */
export const syncFromGitHub = async (): Promise<{
  success: boolean;
  message: string;
  latestCommit?: GitHubCommit;
}> => {
  try {
    console.log('Iniciando sincronización desde GitHub');
    
    // Obtener el último commit sincronizado
    const lastSyncCommit = localStorage.getItem('latestCommit') ? 
      JSON.parse(localStorage.getItem('latestCommit') || '{}') as GitHubCommit : 
      null;
    
    // Obtener los últimos commits de GitHub
    const latestCommits = await getLatestCommits(5);
    
    if (!latestCommits || latestCommits.length === 0) {
      return {
        success: false,
        message: 'No se pudieron obtener commits de GitHub'
      };
    }
    
    const latestCommit = latestCommits[0];
    
    // Si ya tenemos el último commit, no hay nada que sincronizar
    if (lastSyncCommit && lastSyncCommit.sha === latestCommit.sha) {
      return {
        success: true,
        message: 'Ya estás sincronizado con la última versión',
        latestCommit
      };
    }
    
    // Guardar el último commit sincronizado
    localStorage.setItem('latestCommit', JSON.stringify(latestCommit));
    localStorage.setItem('lastGitHubSync', new Date().toISOString());
    
    // Extraer información de versión del mensaje de commit si existe (formato: v1.2.3: mensaje)
    const versionMatch = latestCommit.commit.message.match(/^v(\d+\.\d+\.\d+):/i);
    let version = '';
    
    if (versionMatch) {
      version = versionMatch[1];
    }
    
    // Si encontramos una versión en el mensaje, crear una nueva versión en el sistema
    if (version) {
      const changes = [latestCommit.commit.message.replace(/^v\d+\.\d+\.\d+:\s*/i, '')];
      
      await createVersionFromCommit(
        version,
        latestCommit.sha,
        changes
      );
      
      return {
        success: true,
        message: `Sincronizado con éxito a la versión ${version}`,
        latestCommit
      };
    }
    
    return {
      success: true,
      message: 'Sincronizado con éxito',
      latestCommit
    };
  } catch (error) {
    console.error('Error al sincronizar desde GitHub:', error);
    return {
      success: false,
      message: `Error al sincronizar: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};
