
import { User, Role } from './types';

// Mock authentication - in a real app, this would connect to a backend
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Demo users for testing
      if (email === 'admin@example.com' && password === 'password') {
        resolve({
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        });
      } else if (email === 'cashier@example.com' && password === 'password') {
        resolve({
          id: '2',
          name: 'Cashier User',
          email: 'cashier@example.com',
          role: 'cashier',
        });
      } else if (email === 'operator@example.com' && password === 'password') {
        resolve({
          id: '3',
          name: 'Operator User',
          email: 'operator@example.com',
          role: 'operator',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // Simulate getting user from localStorage or session
    const userJson = localStorage.getItem('user');
    if (userJson) {
      resolve(JSON.parse(userJson));
    } else {
      resolve(null);
    }
  });
};

export const hasPermission = (user: User | null, requiredRoles: Role[]): boolean => {
  if (!user) return false;
  
  // Admin has access to everything
  if (user.role === 'admin') return true;
  
  // Check if user's role is in the required roles
  return requiredRoles.includes(user.role);
};
