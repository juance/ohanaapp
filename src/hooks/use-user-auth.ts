
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Role } from '@/lib/types/auth.types';

export function useUserAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser?.role === 'admin');
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      
      // Using auth.ts login function
      // In a real implementation, this would verify with Supabase
      const userData = {
        id: '1',
        name: phoneNumber === 'admin@example.com' ? 'Admin User' : 'Staff User',
        email: phoneNumber,
        phoneNumber: '',
        role: phoneNumber === 'admin@example.com' ? 'admin' : 'operator' as Role
      };
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
      
      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Clear user data
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('user');
      
      // Navigate to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'admin') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(user.role);
  };

  return {
    user,
    loading,
    isAdmin,
    login,
    logout,
    hasPermission
  };
}
