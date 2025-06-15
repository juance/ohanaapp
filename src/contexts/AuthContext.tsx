
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Role, User } from '@/lib/types/auth.types';
import { useAuthLogin } from '@/hooks/auth/useAuthLogin';
import { useAuthLogout } from '@/hooks/auth/useAuthLogout';
import { useAuthRegister } from '@/hooks/auth/useAuthRegister';
import { useAuthRequestPasswordReset } from '@/hooks/auth/useAuthRequestPasswordReset';
import { useAuthChangePassword } from '@/hooks/auth/useAuthChangePassword';
import { useAuthPermission } from '@/hooks/auth/useAuthPermission';
import { checkSupabaseConnection } from '@/lib/supabaseAuthService';

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

  // Lógica de inicialización
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkSupabaseConnection();
        const savedUser = localStorage.getItem('authUser');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
          } catch {
            localStorage.removeItem('authUser');
          }
        }
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = useAuthLogin({ setUser, setLoading, setError });
  const logout = useAuthLogout({ setUser });
  const register = useAuthRegister({ setUser, setLoading, setError });
  const requestPasswordReset = useAuthRequestPasswordReset({ setLoading, setError });
  const changePassword = useAuthChangePassword({ user, setUser, setLoading, setError });
  const checkUserPermission = useAuthPermission({ user });

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      checkUserPermission,
      register,
      requestPasswordReset,
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
