
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { SystemVersion, SystemChange } from '@/hooks/useSystemVersions';

/**
 * Fetch all system versions
 */
export const getSystemVersions = async (): Promise<SystemVersion[]> => {
  try {
    const { data, error } = await supabase
      .from('system_version')
      .select('*')
      .order('release_date', { ascending: false });

    if (error) throw error;

    // Transform data to match our interface
    return data.map((item: any) => ({
      id: item.id,
      version: item.version,
      releaseDate: item.release_date,
      // Ensure changes is always an array of SystemChange objects
      changes: Array.isArray(item.changes) 
        ? item.changes.map((change: any) => ({
            type: change.type || 'other',
            title: change.title || '',
            description: change.description || ''
          })) 
        : [],
      isActive: item.is_active
    }));
  } catch (error) {
    console.error('Error fetching system versions:', error);
    toast.error('Error al obtener versiones del sistema');
    return [];
  }
};

/**
 * Get the current active system version
 */
export const getCurrentVersion = async (): Promise<SystemVersion | null> => {
  try {
    const { data, error } = await supabase
      .from('system_version')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      version: data.version,
      releaseDate: data.release_date,
      // Ensure changes is always an array of SystemChange objects
      changes: Array.isArray(data.changes) 
        ? data.changes.map((change: any) => ({
            type: change.type || 'other',
            title: change.title || '',
            description: change.description || ''
          })) 
        : [],
      isActive: data.is_active
    };
  } catch (error) {
    console.error('Error fetching current version:', error);
    return null;
  }
};

/**
 * Set a specific version as the active one
 */
export const setActiveVersion = async (versionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('system_version')
      .update({ is_active: true })
      .eq('id', versionId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error setting active version:', error);
    toast.error('Error al activar versión');
    return false;
  }
};

/**
 * Add a new system version
 */
export const addSystemVersion = async (
  version: string,
  changes: SystemChange[],
  releaseDate?: Date
): Promise<boolean> => {
  try {
    // We need to ensure the changes array is properly formatted for JSON storage
    const formattedChanges = changes.map(change => ({
      type: change.type,
      title: change.title,
      description: change.description
    }));

    const { error } = await supabase
      .from('system_version')
      .insert({
        version: version,
        changes: formattedChanges,
        release_date: releaseDate ? releaseDate.toISOString() : new Date().toISOString(),
        is_active: false // New versions are not active by default
      });

    if (error) throw error;

    toast.success('Nueva versión agregada correctamente');
    return true;
  } catch (error) {
    console.error('Error adding system version:', error);
    toast.error('Error al agregar versión');
    return false;
  }
};

/**
 * Rollback to a specific version
 */
export const rollbackToVersion = async (versionId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would perform the actual rollback
    // of database schema, code, etc.
    
    // For now, we'll just set the version as active
    const { error } = await supabase
      .from('system_version')
      .update({ is_active: true })
      .eq('id', versionId);

    if (error) throw error;

    toast.success('Sistema restaurado correctamente');
    return true;
  } catch (error) {
    console.error('Error rolling back to version:', error);
    toast.error('Error al restaurar versión');
    return false;
  }
};
