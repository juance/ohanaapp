
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/lib/types/auth';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        sessionStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    // Mock login for now
    setLoading(true);
    try {
      // Simulating successful login
      const mockUser: User = {
        id: '1',
        name: 'Usuario Demo',
        email: 'demo@example.com',
        phoneNumber: phoneNumber,
        role: 'admin',
      };
      
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error during login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, phoneNumber: string, password: string, role: Role = 'client') => {
    // Mock registration for now
    setLoading(true);
    try {
      // Simulating successful registration
      const mockUser: User = {
        id: '2',
        name: name,
        email: '',
        phoneNumber: phoneNumber,
        role: role,
      };
      
      sessionStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error during registration');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const checkUserPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
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
      checkUserPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
