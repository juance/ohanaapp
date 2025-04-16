import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

/**
 * Iniciar sesión anónima en Supabase
 * Esto es necesario para poder acceder a la base de datos
 */
export const signInAnonymously = async (): Promise<boolean> => {
  try {
    // Verificar si ya hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('Ya hay una sesión activa en Supabase');
      return true;
    }
    
    // Iniciar sesión anónima
    console.log('Iniciando sesión anónima en Supabase...');
    const { error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Error al iniciar sesión anónima:', error);
      return false;
    }
    
    console.log('Sesión anónima iniciada correctamente');
    return true;
  } catch (error) {
    console.error('Error en signInAnonymously:', error);
    return false;
  }
};

/**
 * Verificar y renovar la sesión de Supabase si es necesario
 */
export const ensureSupabaseSession = async (): Promise<boolean> => {
  try {
    // Verificar si hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Verificar si la sesión está por expirar (menos de 5 minutos)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;
      
      if (expiresAt && expiresAt - now < fiveMinutes) {
        console.log('La sesión está por expirar, renovando...');
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Error al renovar la sesión:', error);
          return signInAnonymously();
        }
        
        console.log('Sesión renovada correctamente');
      }
      
      return true;
    }
    
    // No hay sesión, iniciar una nueva
    return signInAnonymously();
  } catch (error) {
    console.error('Error en ensureSupabaseSession:', error);
    return signInAnonymously();
  }
};

/**
 * Inicializar la autenticación de Supabase
 * Debe llamarse al inicio de la aplicación
 */
export const initSupabaseAuth = async (): Promise<void> => {
  try {
    const success = await signInAnonymously();
    
    if (!success) {
      toast.error('Error al inicializar la autenticación de Supabase');
    }
  } catch (error) {
    console.error('Error en initSupabaseAuth:', error);
    toast.error('Error al inicializar la autenticación de Supabase');
  }
};
