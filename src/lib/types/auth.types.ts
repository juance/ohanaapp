
// Define the Role type to match what's used in AuthContext
export type Role = 'admin' | 'operator' | 'client';

// Define the User interface
export interface User {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
  requiresPasswordChange?: boolean;
}

// Basic auth interfaces for backward compatibility
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
