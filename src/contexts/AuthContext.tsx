
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/lib/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (name: string, phoneNumber: string, password: string, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPermission: (requiredRoles: Role[]) => boolean;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkUserPermission: () => false,
  changePassword: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedExpiry = sessionStorage.getItem('user_expiry');

    if (storedUser && storedExpiry) {
      try {
        const expiryTime = parseInt(storedExpiry, 10);
        const now = Date.now();

        if (now > expiryTime) {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('user_expiry');
        } else {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('user_expiry');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('get_user_by_phone', { phone: phoneNumber });

      if (error || !data || data.length === 0) {
        throw new Error('Usuario no encontrado o contraseña incorrecta');
      }

      const userData = data[0];

      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }

      const authenticatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email || undefined,
        phoneNumber: userData.phone_number,
        role: userData.role as Role,
      };

      const expiryTime = Date.now() + (8 * 60 * 60 * 1000);
      sessionStorage.setItem('user', JSON.stringify(authenticatedUser));
      sessionStorage.setItem('user_expiry', expiryTime.toString());
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

  const register = async (name: string, phoneNumber: string, password: string, role: Role = 'client') => {
    try {
      setLoading(true);
      setError(null);

      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      const { data: existingUser, error: checkError } = await supabase
        .rpc('get_user_by_phone', { phone: phoneNumber });

      if (!checkError && existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
        throw new Error('El número de teléfono ya está registrado');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { data, error } = await supabase
        .rpc('create_user', {
          user_name: name,
          user_phone: phoneNumber,
          user_password: hashedPassword,
          user_role: role
        });

      if (error) {
        if (error.message && error.message.includes('contraseña')) {
          throw new Error(error.message);
        }
        throw new Error('Error al crear la cuenta');
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error('Error al crear la cuenta');
      }

      const userData = Array.isArray(data) ? data[0] : data;

      const newUser: User = {
        id: userData.id,
        name: userData.name,
        phoneNumber: userData.phone_number,
        role: userData.role as Role,
      };

      const expiryTime = Date.now() + (8 * 60 * 60 * 1000);
      sessionStorage.setItem('user', JSON.stringify(newUser));
      sessionStorage.setItem('user_expiry', expiryTime.toString());
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

  const logout = async () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_expiry');
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
    
    // Instead of using navigate, we'll use window.location for redirection after logout
    window.location.href = '/auth';
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);

      if (!user || !user.phoneNumber) {
        throw new Error('Usuario no autenticado');
      }

      const updatedUser = { ...user, requiresPasswordChange: false };
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
        variant: "default",
      });

      // Instead of navigate, use window.location
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Error al cambiar la contraseña');
      toast({
        title: "Error",
        description: err.message || 'Error al cambiar la contraseña',
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkUserPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;

    if (user.role === 'admin') return true;

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
      checkUserPermission,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
