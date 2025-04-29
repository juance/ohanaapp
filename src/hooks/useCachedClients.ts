
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cacheService } from '@/lib/cacheService';
import { toast } from '@/lib/toast';

export interface CachedClient {
  id: string;
  name: string;
  phone: string;
  valets_count: number;
  free_valets: number;
  loyalty_points: number;
  last_visit?: string;
}

export const useCachedClients = () => {
  const [clients, setClients] = useState<CachedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const fetchFunction = async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('name');
          
        if (error) throw error;
        return data as CachedClient[];
      };
      
      // Get from cache or fetch new data with 5 minute TTL
      const data = await cacheService.getOrFetch<CachedClient[]>(
        'all-clients',
        fetchFunction,
        { namespace: 'clients', ttl: 5 * 60 * 1000 }
      );
      
      setClients(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invalidateCache = useCallback(() => {
    cacheService.invalidateNamespace('clients');
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, isLoading, error, invalidateCache, refetch: fetchClients };
};
