
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  role?: Role;
  name?: string;
  avatar_url?: string;
}

export type Role = 'admin' | 'operator' | 'client';

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
