
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '@/lib/types/auth.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserPermission: (allowedRoles: Role[]) => boolean;
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
        return;
      }
      
      throw new Error('Invalid credentials');
    } catch (err) {
      setError(err as Error);
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
      
      // Redirect to the authentication page (will be handled by the protected route)
      window.location.href = '/auth';
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error during logout:', error);
      return Promise.reject(error);
    }
  };

  const checkUserPermission = (allowedRoles: Role[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role as Role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkUserPermission }}>
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
