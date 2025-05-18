
// Basic auth interfaces for backward compatibility
export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserData {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}
