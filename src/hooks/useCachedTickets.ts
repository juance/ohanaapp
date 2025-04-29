
import { useState, useEffect, useCallback } from 'react';
import { Ticket } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { cacheService } from '@/lib/cacheService';
import { toast } from '@/lib/toast';

export const useCachedTickets = (statusFilter?: string) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = useCallback(async () => {
    const cacheKey = statusFilter ? `tickets-${statusFilter}` : 'tickets-all';
    
    try {
      setIsLoading(true);
      
      const fetchFunction = async () => {
        let query = supabase.from('tickets').select('*');
        
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Ticket[];
      };
      
      // Get from cache or fetch new data with 2 minute TTL
      const data = await cacheService.getOrFetch<Ticket[]>(
        cacheKey,
        fetchFunction,
        { namespace: 'tickets', ttl: 2 * 60 * 1000 }
      );
      
      setTickets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast.error('Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const invalidateCache = useCallback(() => {
    cacheService.invalidateNamespace('tickets');
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading, error, invalidateCache, refetch: fetchTickets };
};
