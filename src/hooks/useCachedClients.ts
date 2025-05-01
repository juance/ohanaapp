
import { useState, useEffect } from 'react';
import { getAllClients } from '@/lib/dataService';
import { ClientVisit, Customer, convertCustomerToClientVisit } from '@/lib/types';
import { cacheService } from '@/lib/services/cacheService';

const CACHE_KEY = 'clientsCache';
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have a cached result
      const cachedData = cacheService.get<ClientVisit[]>(CACHE_KEY);
      
      if (cachedData && !forceRefresh) {
        setClients(cachedData);
        setIsLoading(false);
        
        // Refresh in background if the cache is older than expiration time
        const cacheAge = Date.now() - cacheService.getTimestamp(CACHE_KEY);
        if (cacheAge > CACHE_EXPIRATION) {
          refreshClientsInBackground();
        }
        return;
      }
      
      // No cache or forced refresh - fetch from API
      const customersData = await getAllClients();
      const clientVisits = customersData.map(convertCustomerToClientVisit);
      
      // Update the cache
      cacheService.set(CACHE_KEY, clientVisits);
      
      setClients(clientVisits);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClientsInBackground = async () => {
    try {
      const customersData = await getAllClients();
      const clientVisits = customersData.map(convertCustomerToClientVisit);
      
      // Update the cache
      cacheService.set(CACHE_KEY, clientVisits);
      
      // Only update state if the component is still mounted
      setClients(clientVisits);
    } catch (err) {
      console.error('Error refreshing clients in background:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    error,
    refreshClients: () => fetchClients(true)
  };
};
