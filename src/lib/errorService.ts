import { supabase } from '@/integrations/supabase/client';
import { SystemError } from '@/lib/types';

export const logError = async (
  error: Error | unknown,
  context: Record<string, any> = {}
): Promise<void> => {
  try {
    const errorData: SystemError = {
      id: crypto.randomUUID(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date(),
      context: context,
      resolved: false,
      component: context.component
    };

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorData);

    if (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  } catch (loggingError) {
    console.error('Error in error logging service:', loggingError);
  }
};
