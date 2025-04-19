
import { useState } from 'react';
import { Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export function useFreeValet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const useFreeValetForCustomer = async (customer: Customer) => {
    try {
      setLoading(true);
      setError(null);

      if (!customer || !customer.id) {
        throw new Error('Customer information is missing');
      }

      if (!customer.free_valets || customer.free_valets <= 0) {
        throw new Error('No free valets available for this customer');
      }

      // Update the customer record in Supabase
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          free_valets: Math.max((customer.free_valets || 0) - 1, 0),
          valets_redeemed: (customer.valets_redeemed || 0) + 1
        })
        .eq('id', customer.id);

      if (updateError) throw updateError;

      toast.success('Se ha utilizado un valet gratis correctamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al utilizar el valet gratis';
      console.error('Error using free valet:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { useFreeValetForCustomer, loading, error };
}
