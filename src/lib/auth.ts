
import { User, Role } from './types';

// Mock authentication - in a real app, this would connect to a backend
export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      // Admin users
      if (email === 'juance' && password === 'Juance001') {
        resolve({
          id: '1',
          name: 'Juance',
          email: 'juance@example.com',
          role: 'admin',
        });
      } else if (email === 'nahir' && password === 'Nahir001') {
        resolve({
          id: '2',
          name: 'Nahir',
          email: 'nahir@example.com',
          role: 'admin',
        });
      } else if (email === 'carla' && password === 'carla001') {
        resolve({
          id: '3',
          name: 'Carla',
          email: 'carla@example.com',
          role: 'admin',
        });
      } 
      // Operator user
      else if (email === 'vanesa' && password === 'vanesa01') {
        resolve({
          id: '4',
          name: 'Vanesa',
          email: 'vanesa@example.com',
          role: 'operator',
        });
      }
      // Regular users (will be registered)
      else if (email === 'admin@example.com' && password === 'password') {
        resolve({
          id: '5',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        });
      } else if (email === 'cashier@example.com' && password === 'password') {
        resolve({
          id: '6',
          name: 'Cashier User',
          email: 'cashier@example.com',
          role: 'cashier',
        });
      } else if (email === 'operator@example.com' && password === 'password') {
        resolve({
          id: '7',
          name: 'Operator User',
          email: 'operator@example.com',
          role: 'operator',
        });
      } 
      // Check for registered users in localStorage
      else {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const user = registeredUsers.find(
          (u: any) => u.email === email && u.password === password
        );
        
        if (user) {
          resolve({
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'user',
          });
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }
    }, 500);
  });
};

// User registration function
export const registerUser = (
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Get existing users
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        
        // Check if user with email already exists
        if (registeredUsers.some((user: any) => user.email === email)) {
          reject(new Error('Ya existe un usuario con este correo electrónico'));
          return;
        }
        
        // Check if user with phone already exists
        if (registeredUsers.some((user: any) => user.phone === phone)) {
          reject(new Error('Ya existe un usuario con este número de teléfono'));
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          phone,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        // Add to registered users
        registeredUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        
        // Return user object (without password)
        const { password: _, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword as User);
      } catch (error) {
        reject(new Error('Error al registrar el usuario'));
      }
    }, 500);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      localStorage.removeItem('user');
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
