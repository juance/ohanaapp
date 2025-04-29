
import { useState, useEffect } from 'react';
import { getAllClients } from '@/lib/dataService';
import { ClientVisit } from '@/lib/types';
import { cacheService } from '@/lib/services/cacheService';

// Define a proper implementation of cacheService that's actually used
export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const CACHE_KEY = 'clients_list';

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Check cache first
      const cachedData = cacheService.get<ClientVisit[]>(CACHE_KEY);
      
      if (cachedData) {
        setClients(cachedData);
        setIsLoading(false);
        
        // Refresh in background
        refreshClientsInBackground();
        return;
      }
      
      // No cache, fetch from API
      const data = await getAllClients();
      setClients(data);
      
      // Save to cache
      cacheService.set(CACHE_KEY, data, 60 * 5); // Cache for 5 minutes
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      console.error('Error fetching clients:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshClientsInBackground = async () => {
    try {
      const freshData = await getAllClients();
      setClients(freshData);
      cacheService.set(CACHE_KEY, freshData, 60 * 5); // Update cache
    } catch (err) {
      console.error('Error refreshing clients in background:', err);
      // Don't set error state here as this is a background refresh
    }
  };
  
  const invalidateCache = () => {
    cacheService.remove(CACHE_KEY);
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refetch: fetchClients,
    invalidateCache
  };
};
