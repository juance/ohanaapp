
export type Role = 'admin' | 'operator' | 'client';

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: Role;
  email?: string;
  createdAt?: string;
  requiresPasswordChange?: boolean;
}

export interface UserWithPassword extends Omit<User, 'id' | 'createdAt'> {
  password: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  name: string;
  phoneNumber: string;
  password: string;
  email?: string;
}
