
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/lib/types/auth.types';
import { toast } from '@/lib/toast';
import { 
  authenticateUser, 
  registerUser, 
  requestPasswordReset, 
  hasPermission,
  checkSupabaseConnection 
} from '@/lib/supabaseAuthService';
import { logError } from '@/lib/errorService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPermission: (allowedRoles: Role[]) => boolean;
  register: (name: string, phone: string, password: string) => Promise<void>;
  requestPasswordReset: (phone: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar conexión a Supabase
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          console.warn('No se pudo conectar a Supabase, usando modo local');
        }
        
        // Verificar sesión guardada
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            console.log('Sesión restaurada:', parsedUser.name);
          } catch (e) {
            console.error('Error al restaurar sesión:', e);
            localStorage.removeItem('authUser');
          }
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await authenticateUser(phone, password);
      
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
      
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      await logError(error, { 
        context: 'auth', 
        action: 'login',
        phone 
      });
      
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error.message || 'Error al iniciar sesión'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('authUser');
      
      toast({
        title: "Sesión finalizada",
        description: "Has cerrado sesión correctamente"
      });
      
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('Error durante cierre de sesión:', error);
      throw error;
    }
  };

  const register = async (name: string, phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await registerUser(name, phone, password);
      
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      toast({
        title: "Registro exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
      
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      await logError(error, { 
        context: 'auth', 
        action: 'register',
        phone 
      });
      
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.message || 'Error al registrar usuario'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const requestResetPassword = async (phone: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await requestPasswordReset(phone);
      
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      await logError(error, { 
        context: 'auth', 
        action: 'requestPasswordReset',
        phone 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Error al solicitar cambio de contraseña'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const changePasswordHandler = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('No hay usuario conectado');
      }
      
      // En producción, verificar contraseña actual aquí
      const success = await changePassword(user.id, oldPassword, newPassword);
      
      if (success) {
        const updatedUser = {
          ...user,
          requiresPasswordChange: false
        };
        
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada exitosamente"
        });
      }
      
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Error al cambiar la contraseña'
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkUserPermission = (allowedRoles: Role[]): boolean => {
    return hasPermission(user, allowedRoles);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      checkUserPermission,
      register,
      requestPasswordReset: requestResetPassword,
      changePassword: changePasswordHandler
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};
