
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/lib/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (name: string, phoneNumber: string, password: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPermission: (requiredRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkUserPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (phoneNumber: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For this implementation, we'll use a simplified approach
      // In a production app, you would use Supabase authentication
      
      // Simulate API call to check credentials
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (error || !data) {
        throw new Error('Usuario no encontrado o contraseña incorrecta');
      }
      
      // In a real implementation, you'd verify the password here
      // This is a simplified version for demo purposes
      if (data.password !== password) {
        throw new Error('Contraseña incorrecta');
      }
      
      // Create user object
      const authenticatedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email || undefined,
        phoneNumber: data.phone_number,
        role: data.role as Role,
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${authenticatedUser.name}`,
        variant: "default",
      });
      
    } catch (err: any) {
      setError(err.message || 'Error durante el inicio de sesión');
      toast({
        title: "Error",
        description: err.message || 'Error durante el inicio de sesión',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, phoneNumber: string, password: string, role: Role = 'client') => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (!checkError && existingUser) {
        throw new Error('El número de teléfono ya está registrado');
      }
      
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            phone_number: phoneNumber,
            password, // In a real app, this would be hashed
            role,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();
      
      if (error || !data) {
        throw new Error('Error al crear la cuenta');
      }
      
      // Create user object
      const newUser: User = {
        id: data.id,
        name: data.name,
        phoneNumber: data.phone_number,
        role: data.role as Role,
      };
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
        variant: "default",
      });
      
    } catch (err: any) {
      setError(err.message || 'Error durante el registro');
      toast({
        title: "Error",
        description: err.message || 'Error durante el registro',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
  };
  
  // Check if user has required permissions
  const checkUserPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout,
      checkUserPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
