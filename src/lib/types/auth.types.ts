
// Basic auth interfaces 
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Define the Role type that will be used throughout the application
export type Role = 'admin' | 'operator' | 'staff' | 'client';

// Define the complete User interface
export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  phone_number?: string; // For API compatibility
  role: Role;
  requiresPasswordChange?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserData {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}

// Make sure these interfaces are properly exported
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phoneNumber: string;
  password: string;
}
