
export type Role = 'admin' | 'operator' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
}
