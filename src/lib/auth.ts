
import { User, Role } from './types';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

// Function to generate a random temporary password
const generateTempPassword = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Mock authentication - in a real app, this would connect to a backend
export const login = (phoneNumber: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Admin user with specific phone number
      if (phoneNumber === '1123989718' && password === 'Juance001') {
        resolve({
          id: 'admin-001',
          name: 'Admin General',
          role: 'admin',
          phoneNumber: '1123989718',
        });
      } 
      // Demo users for testing
      else if (phoneNumber === 'admin@example.com' && password === 'password') {
        resolve({
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        });
      } else if (phoneNumber === 'cashier@example.com' && password === 'password') {
        resolve({
          id: '2',
          name: 'Cashier User',
          email: 'cashier@example.com',
          role: 'staff',
        });
      } else if (phoneNumber === 'operator@example.com' && password === 'password') {
        resolve({
          id: '3',
          name: 'Operator User',
          email: 'operator@example.com',
          role: 'staff',
        });
      } else if (phoneNumber.startsWith('+') && checkTemporaryPassword(phoneNumber, password)) {
        // Phone login with temporary password
        const userData = getTempPasswordUserData(phoneNumber);
        if (userData) {
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
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

// Temporary password storage (would be in a database in a real app)
const tempPasswordStore: Record<string, { password: string, expiry: number, user: User, isTemp: boolean }> = {};

// Function to request a password reset
export const requestPasswordReset = async (phoneNumber: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if the phone number exists in our system (mock check)
      const userExists = phoneNumber.startsWith('+') || phoneNumber.startsWith('1') || 
                        phoneNumber === '1234567890' || phoneNumber === '0987654321';
      
      if (!userExists) {
        reject(new Error('No existe una cuenta asociada a este número de teléfono'));
        return;
      }
      
      // Generate a temporary password
      const tempPassword = generateTempPassword();
      
      // Store the temporary password (would be in a database in a real app)
      // It expires in 30 minutes
      const expiry = Date.now() + (30 * 60 * 1000);
      
      // Create fake user data
      const userData: User = {
        id: phoneNumber,
        name: 'Usuario Temporal',
        phoneNumber: phoneNumber,
        role: 'staff', // Changed from 'client' to 'staff' to match allowed Role values
        requiresPasswordChange: true
      };
      
      tempPasswordStore[phoneNumber] = {
        password: tempPassword,
        expiry,
        user: userData,
        isTemp: true
      };
      
      // In a real app, this would send a WhatsApp message
      console.log(`[WhatsApp] To: ${phoneNumber}, Message: Tu contraseña temporal es: ${tempPassword}`);
      
      // Show success toast (just for demo)
      toast({
        title: "Solicitud enviada",
        description: `Se ha enviado un WhatsApp al número ${phoneNumber}`,
      });
      
      resolve();
    }, 1500);
  });
};

// Check if a password is a temporary one
const checkTemporaryPassword = (phoneNumber: string, password: string): boolean => {
  const tempData = tempPasswordStore[phoneNumber];
  
  if (!tempData) return false;
  
  // Check if the password has expired
  if (tempData.expiry < Date.now()) {
    delete tempPasswordStore[phoneNumber];
    return false;
  }
  
  return tempData.password === password;
};

// Get user data for a temporary password
const getTempPasswordUserData = (phoneNumber: string): User | null => {
  const tempData = tempPasswordStore[phoneNumber];
  
  if (!tempData) return null;
  
  return tempData.user;
};
