
import { hasPermission } from '@/lib/supabaseAuthService';
import { Role, User } from '@/lib/types/auth.types';

type Props = {
  user: User | null;
};

export const useAuthPermission = ({ user }: Props) => {
  return (allowedRoles: Role[]): boolean => {
    return hasPermission(user, allowedRoles);
  };
};
