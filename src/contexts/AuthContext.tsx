
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/lib/types/auth.types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPermission: (allowedRoles: Role[]) => boolean;
  register: (name: string, phone: string, password: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if there's a saved user session in localStorage
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user:', e);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock authentication for demonstration purposes
      // In a real app, this would call your auth API
      if (email === 'admin@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Admin User',
          email,
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${userData.name}`,
        });
        
        return;
      }
      
      if (email === 'operator@example.com' && password === 'password') {
        const userData: User = {
          id: '2',
          name: 'Operator User',
          email,
          role: 'operator'
        };
        
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${userData.name}`,
        });
        
        return;
      }
      
      if (email === 'client@example.com' && password === 'password') {
        const userData: User = {
          id: '3',
          name: 'Client User',
          email,
          role: 'client'
        };
        
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${userData.name}`,
        });
        
        return;
      }
      
      throw new Error('Credenciales inválidas');
    } catch (err) {
      setError(err as Error);
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
      // Remove the user session
      setUser(null);
      localStorage.removeItem('authUser');
      
      toast({
        title: "Sesión finalizada",
        description: "Has cerrado sesión correctamente"
      });
      
      // Redirect to the authentication page (will be handled by the protected route)
      window.location.href = '/auth';
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      return Promise.reject(error);
    }
  };

  const register = async (name: string, phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock registration process
      // In a real app, this would call your auth API
      
      // Create a new user
      const userData: User = {
        id: Date.now().toString(),
        name,
        phoneNumber: phone,
        role: 'client'
      };
      
      // Save the user data
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      toast({
        title: "Registro exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
      
    } catch (err) {
      setError(err as Error);
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

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock password change
      // In a real app, this would call your auth API to validate the old password and set the new one
      
      if (user) {
        // Update user object to indicate password has been changed
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
    if (!user) return false;
    return allowedRoles.includes(user.role as Role);
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
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
