
import { changePassword } from '@/lib/supabaseAuthService';
import { toast } from '@/lib/toast';
import { User } from '@/lib/types/auth.types';

type Props = {
  user: User | null;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: Error | null) => void;
};

export const useAuthChangePassword = ({ user, setUser, setLoading, setError }: Props) => {
  return async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('No hay usuario conectado');

      const success = await changePassword(user.id, oldPassword, newPassword);
      if (success) {
        const updatedUser = { ...user, requiresPasswordChange: false };
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido cambiada exitosamente"
        });
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Error al cambiar la contraseña'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
};
