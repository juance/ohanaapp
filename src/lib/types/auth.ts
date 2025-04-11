
export type Role = 'admin' | 'operator' | 'client';

export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
