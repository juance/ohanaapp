
import { User as SupabaseUser } from '@supabase/supabase-js';

// Extendiendo User para incluir campos adicionales
export interface User extends SupabaseUser {
  role?: Role;
  name?: string;
  avatar_url?: string;
  phoneNumber?: string; // Añadido para compatibilidad con UserDialog y UserManagement
}

export type Role = 'admin' | 'operator' | 'client' | 'staff'; // Añadido 'staff' para compatibilidad con lib/auth.ts

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
  phoneNumber: string; // Añadido para compatibilidad con UserDialog
  role: Role;
  password: string;
}
