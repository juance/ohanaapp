
import { registerUser } from '@/lib/supabaseAuthService';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';
import { User } from '@/lib/types/auth.types';

type Props = {
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (err: Error | null) => void;
};

export const useAuthRegister = ({ setUser, setLoading, setError }: Props) => {
  return async (name: string, phone: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const userData = await registerUser(name, phone, password);
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));

      toast({
        title: "Registro exitoso",
        description: `Bienvenido, ${userData.name}`,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);

      await logError(error, {
        context: 'auth',
        action: 'register',
        phone
      });

      toast({
        variant: "destructive",
        title: "Error de registro",
        description: error.message || 'Error al registrar usuario'
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };
};
