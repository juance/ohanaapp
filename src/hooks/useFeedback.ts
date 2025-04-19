
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { CustomerFeedback } from '@/lib/types';

export const useFeedback = (lastCheckTime: string) => {
  const [newClientFeedbackCount, setNewClientFeedbackCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkForNewClientFeedback = async () => {
      try {
        let newComments = [];
        let hasSourceColumn = true;

        try {
          const { data, error } = await supabase
            .from('customer_feedback')
            .select('*')
            .eq('source', 'client_portal')
            .gt('created_at', lastCheckTime);

          if (error) {
            if (error.code === '42703' && error.message.includes('column customer_feedback.source does not exist')) {
              hasSourceColumn = false;
            } else {
              throw error;
            }
          } else if (data) {
            newComments = data;
          }
        } catch (err) {
          if (err.code === '42703' && err.message.includes('column customer_feedback.source does not exist')) {
            hasSourceColumn = false;
          } else {
            throw err;
          }
        }

        if (!hasSourceColumn) {
          const { data, error } = await supabase
            .from('customer_feedback')
            .select('*')
            .gt('created_at', lastCheckTime);

          if (error) throw error;
          if (data) newComments = data;
        }

        if (newComments.length > 0) {
          setNewClientFeedbackCount(newComments.length);
          toast({
            title: `${newComments.length} ${newComments.length === 1 ? 'nuevo comentario' : 'nuevos comentarios'}`,
            description: 'Se han recibido nuevos comentarios de clientes',
          });
        }
      } catch (err) {
        console.error('Error al verificar nuevos comentarios:', err);
        setError(err instanceof Error ? err : new Error('Error checking feedback'));
      } finally {
        setIsLoading(false);
      }
    };

    checkForNewClientFeedback();
    const intervalId = setInterval(checkForNewClientFeedback, 60000);

    return () => clearInterval(intervalId);
  }, [lastCheckTime]);

  return {
    newClientFeedbackCount,
    error,
    isLoading
  };
};
