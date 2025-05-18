
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = 'admin' | 'operator' | 'client';

interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  checkUserPermission: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkUserSession = async () => {
      try {
        // For now, we'll use localStorage for demo purposes
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login success - in a real app, this would call an authentication API
      const mockUser: User = {
        id: "1",
        name: "Admin User",
        email: email,
        role: "admin"
      };
      
      setUser(mockUser);
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const checkUserPermission = (roles: Role[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        checkUserPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
