import { useState, useEffect } from 'react';
import { ClientVisit } from '@/lib/types/customer.types';
import { getAllClients } from '@/lib/dataService';
import { cacheService } from '@/lib/cacheService';
import { toast } from '@/hooks/use-toast';

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Implementar la versión simple sin usar getOrFetch
const fetchAndCacheClients = async () => {
  const cacheKey = 'all-clients';
  
  // Check if data is in cache
  const cachedData = cacheService.get<ClientVisit[]>(cacheKey);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // Fetch fresh data
  const data = await getAllClients();
  
  // Cache the result with TTL of 5 minutes
  cacheService.set(cacheKey, data, 5 * 60 * 1000);
  
  return data;
};

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const cachedClients = await fetchAndCacheClients();
        setClients(cachedClients);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError(err instanceof Error ? err : new Error('Failed to load clients'));
        toast({
          title: "Error",
          description: "Failed to load clients.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Implementar una versión simple de invalidación de cache
const invalidateClientsCache = () => {
  cacheService.delete('all-clients');
  // También podemos invalidar otras claves relacionadas si las hay
};

  const refreshClients = async () => {
    setLoading(true);
    setError(null);
    try {
      // Invalidate cache
      invalidateClientsCache();

      // Fetch fresh data
      const freshClients = await getAllClients();
      setClients(freshClients);

      // Update cache
      cacheService.set('all-clients', freshClients, 5 * 60 * 1000);

      toast({
        title: "Clientes actualizados",
        description: "La lista de clientes ha sido actualizada.",
        variant: "success"
      });
    } catch (err) {
      console.error("Error refreshing clients:", err);
      setError(err instanceof Error ? err : new Error('Failed to refresh clients'));
      toast({
        title: "Error",
        description: "Failed to refresh clients.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    refreshClients
  };
};
