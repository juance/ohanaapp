
// Define the Role type to match what's used in AuthContext
export type Role = 'admin' | 'operator' | 'client' | 'staff';

// Define the User interface
export interface User {
  id: string;
  name: string;
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

// For backward compatibility with auth.ts file
export interface UserData {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}
