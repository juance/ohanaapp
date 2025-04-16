import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Verificar la conexión con Supabase
 * Esta función simplemente verifica si podemos conectarnos a Supabase
 * sin necesidad de autenticación
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Verificando conexión con Supabase...');

    // Intentar una consulta simple para verificar la conexión
    const { count, error } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      console.error('Error al verificar la conexión con Supabase:', error);
      return false;
    }

    console.log('Conexión con Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al verificar la conexión con Supabase:', error);
    return false;
  }
};

/**
 * Verificar la conexión con Supabase
 * Esta función es un alias de checkSupabaseConnection para mantener
 * compatibilidad con el código existente
 */
export const ensureSupabaseSession = async (): Promise<boolean> => {
  return await checkSupabaseConnection();
};

/**
 * Inicializar la conexión con Supabase
 * Debe llamarse al inicio de la aplicación
 */
export const initSupabaseAuth = async (): Promise<void> => {
  try {
    const success = await checkSupabaseConnection();

    if (!success) {
      toast.error('Error al conectar con la base de datos');
      console.error('No se pudo establecer conexión con Supabase');
    } else {
      console.log('Conexión con Supabase inicializada correctamente');
    }
  } catch (error) {
    console.error('Error en initSupabaseAuth:', error);
    toast.error('Error al conectar con la base de datos');
  }
};
