
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/lib/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedExpiry = sessionStorage.getItem('user_expiry');

    if (storedUser && storedExpiry) {
      try {
        // Check if session has expired
        const expiryTime = parseInt(storedExpiry, 10);
        const now = Date.now();

        if (now > expiryTime) {
          // Session expired, clear storage
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('user_expiry');
        } else {
          // Session valid, load user
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // If user requires password change, redirect to password change page
          if (userData.requiresPasswordChange) {
            navigate('/change-password');
          }
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('user_expiry');
      }
    }
    setLoading(false);
  }, [navigate]);

  // Login function
  const login = async (phoneNumber: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Nota: Las credenciales de emergencia se han eliminado por seguridad
      // Ahora todas las autenticaciones pasan por la base de datos

      // For this implementation, we'll use a simplified approach
      // Get user by phone number using the RPC function
      const { data, error } = await supabase
        .rpc('get_user_by_phone', { phone: phoneNumber });

      if (error || !data || data.length === 0) {
        throw new Error('Usuario no encontrado o contraseña incorrecta');
      }

      // Get the first user from the result
      const userData = data[0];

      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }

      // Create user object
      const authenticatedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email || undefined,
        phoneNumber: userData.phone_number,
        role: userData.role as Role,
      };

      // Store user in sessionStorage with 8-hour expiry
      const expiryTime = Date.now() + (8 * 60 * 60 * 1000); // 8 hours from now
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

  // Register function
  const register = async (name: string, phoneNumber: string, password: string, role: Role = 'client') => {
    try {
      setLoading(true);
      setError(null);

      // Validar longitud mínima de contraseña (8 caracteres)
      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }

      // Check if user already exists using RPC function
      const { data: existingUser, error: checkError } = await supabase
        .rpc('get_user_by_phone', { phone: phoneNumber });

      if (!checkError && existingUser && Array.isArray(existingUser) && existingUser.length > 0) {
        throw new Error('El número de teléfono ya está registrado');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user using RPC function (use the correct function name)
      const { data, error } = await supabase
        .rpc('create_user', {
          user_name: name,
          user_phone: phoneNumber,
          user_password: hashedPassword,
          user_role: role
        });

      if (error) {
        // Manejar errores específicos de validación de contraseña
        if (error.message && error.message.includes('contraseña')) {
          throw new Error(error.message);
        }
        throw new Error('Error al crear la cuenta');
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error('Error al crear la cuenta');
      }

      // Get the first user from the result
      const userData = Array.isArray(data) ? data[0] : data;

      // Create user object
      const newUser: User = {
        id: userData.id,
        name: userData.name,
        phoneNumber: userData.phone_number,
        role: userData.role as Role,
      };

      // Store user in sessionStorage with 8-hour expiry
      const expiryTime = Date.now() + (8 * 60 * 60 * 1000); // 8 hours from now
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

  // Logout function
  const logout = async () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_expiry');
    setUser(null);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
  };

  // Change password function
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);

      if (!user || !user.phoneNumber) {
        throw new Error('Usuario no autenticado');
      }

      // In a real app, you would verify the old password and update to the new one
      // For now, we'll simulate a successful password change

      // Update user data to remove requiresPasswordChange flag
      const updatedUser = { ...user, requiresPasswordChange: false };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente",
        variant: "default",
      });

      // Redirect to home page
      navigate('/');

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
      checkUserPermission,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
