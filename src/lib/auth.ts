import { User, Role } from '@/lib/types/auth.types';

// Simulated user database
const users = [
  {
    id: '1',
    name: 'Admin User',
    phoneNumber: '1123989718',
    email: 'admin@example.com',
    password: '$2a$10$rHQb1k1LgFXdK9h3cCh2Nu.9v3K1fUdgJqN5y3z4y7F8vH1lFrKWu', // "Juance001"
    role: 'admin' as Role,
  },
  {
    id: '2',
    name: 'Staff User',
    phoneNumber: '1987654321',
    email: 'staff@example.com',
    password: '$2a$10$rHQb1k1LgFXdK9h3cCh2Nu.9v3K1fUdgJqN5y3z4y7F8vH1lFrKWu', // "password123"
    role: 'operator' as Role,
  }
];

export const authenticateUser = async (phoneNumber: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = users.find(u => u.phoneNumber === phoneNumber);
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  // In a real app, you'd hash the password and compare
  // For demo purposes, we'll accept the hardcoded passwords
  const isValidPassword = (phoneNumber === '1123989718' && password === 'Juance001') ||
                         (phoneNumber === '1987654321' && password === 'password123');
  
  if (!isValidPassword) {
    throw new Error('Credenciales incorrectas');
  }
  
  // Return user without password
  return {
    id: user.id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
  };
};

export const registerUser = async (name: string, phoneNumber: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = users.find(u => u.phoneNumber === phoneNumber);
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    phoneNumber,
    email: '',
    password: password, // In real app, this would be hashed
    role: 'client' as Role,
  };
  
  users.push(newUser);
  
  return {
    id: newUser.id,
    name: newUser.name,
    phoneNumber: newUser.phoneNumber,
    email: newUser.email,
    role: newUser.role,
  };
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('authUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem('authUser');
};

export const hasPermission = (user: User | null, allowedRoles: Role[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

// Password reset (placeholder)
export const requestPasswordReset = async (phoneNumber: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Password reset requested for: ${phoneNumber}`);
  // In a real app, this would send an SMS or email
};
