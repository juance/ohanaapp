
import { authenticateUser } from '@/lib/supabaseAuthService';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';
import { User } from '@/lib/types/auth.types';

type Props = {
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: Error | null) => void;
};

export const useAuthLogin = ({ setUser, setLoading, setError }: Props) => {
  return async (phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await authenticateUser(phone, password);
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);

      await logError(error, {
        context: 'auth',
        action: 'login',
        phone
      });

      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: error.message || 'Error al iniciar sesión'
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };
};
