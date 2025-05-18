
// Basic auth interfaces 
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Definir el tipo Role que será utilizado en toda la aplicación
export type Role = 'admin' | 'operator' | 'staff' | 'client';

// Definir la interfaz User completa
export interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  phone_number?: string; // Para compatibilidad con API
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

// Asegurarse que estas interfaces están correctamente exportadas
export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phoneNumber: string;
  password: string;
}
