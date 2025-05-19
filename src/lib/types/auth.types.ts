
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extendiendo User para incluir campos adicionales
export interface User extends Partial<SupabaseUser> {
  id: string;
  role?: Role;
  name?: string;
  avatar_url?: string;
  phoneNumber?: string;
  email?: string;
  requiresPasswordChange?: boolean;
}

export type Role = 'admin' | 'operator' | 'client' | 'staff';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Interfaz para UserWithPassword usada en UserDialog
export interface UserWithPassword {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  password: string;
}
