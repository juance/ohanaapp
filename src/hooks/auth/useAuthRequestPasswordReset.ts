
import { requestPasswordReset } from '@/lib/supabaseAuthService';
import { toast } from '@/lib/toast';
import { logError } from '@/lib/errorService';

type Props = {
  setLoading: (loading: boolean) => void;
  setError: (err: Error | null) => void;
};

export const useAuthRequestPasswordReset = ({ setLoading, setError }: Props) => {
  return async (phone: string) => {
    try {
      setLoading(true);
      setError(null);

      await requestPasswordReset(phone);
    } catch (err) {
      const error = err as Error;
      setError(error);

      await logError(error, {
        context: 'auth',
        action: 'requestPasswordReset',
        phone
      });

      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Error al solicitar cambio de contraseña'
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };
};
