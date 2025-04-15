
export type Role = 'admin' | 'staff' | 'manager';

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: Role;
  requiresPasswordChange?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
