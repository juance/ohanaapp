
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/lib/types/auth.types';
import { toast } from '@/lib/toast';
import { authenticateUser, registerUser, requestPasswordReset, hasPermission } from '@/lib/authService';
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
    // Verificar si hay una sesión guardada en localStorage
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error al analizar usuario guardado:', e);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Autenticar usuario con el servicio
      const userData = await authenticateUser(phone, password);
      
      // Guardar usuario en estado y localStorage
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Mostrar mensaje de éxito
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
      
    } catch (err) {
      setError(err as Error);
      
      // Registrar error
      await logError(err as Error, { 
        context: 'auth', 
        action: 'login',
        phone 
      });
      
      // Mostrar mensaje de error
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: (err as Error).message || 'Error al iniciar sesión'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Eliminar sesión
      setUser(null);
      localStorage.removeItem('authUser');
      
      toast({
        title: "Sesión finalizada",
        description: "Has cerrado sesión correctamente"
      });
      
      // Redirigir a página de autenticación 
      window.location.href = '/auth';
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error durante cierre de sesión:', error);
      return Promise.reject(error);
    }
  };

  const register = async (name: string, phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Registrar nuevo usuario
      const userData = await registerUser(name, phone, password);
      
      // Guardar usuario en estado y localStorage
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      toast({
        title: "Registro exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
      
    } catch (err) {
      setError(err as Error);
      
      // Registrar error
      await logError(err as Error, { 
        context: 'auth', 
        action: 'register',
        phone 
      });
      
      toast({
        variant: "destructive",
        title: "Error de registro",
        description: (err as Error).message || 'Error al registrar usuario'
      });
      
      throw err;
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
      setError(err as Error);
      
      // Registrar error
      await logError(err as Error, { 
        context: 'auth', 
        action: 'requestPasswordReset',
        phone 
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message || 'Error al solicitar cambio de contraseña'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // En producción, aquí verificaríamos y cambiaríamos la contraseña
      if (user) {
        // Actualizar usuario para indicar que ha cambiado la contraseña
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
        
        return Promise.resolve();
      }
      
      throw new Error('No hay usuario conectado');
    } catch (err) {
      setError(err as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as Error).message || 'Error al cambiar la contraseña'
      });
      throw err;
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
      changePassword
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
