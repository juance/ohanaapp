
import { useState, useCallback } from 'react';
import { ClientVisit } from '@/lib/types';
import { dataCache, createCacheKey } from '@/lib/cacheUtils';

// Cache key for client data
const CLIENTS_CACHE_KEY = 'clients';
// Cache duration - 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Hook for client data caching
 */
export const useClientCache = () => {
  const [clientData, setClientData] = useState<ClientVisit[]>([]);
  
  const getCachedClients = useCallback((): ClientVisit[] | null => {
    const cacheKey = createCacheKey(CLIENTS_CACHE_KEY);
    return dataCache.get<ClientVisit[]>(cacheKey, CACHE_DURATION);
  }, []);
  
  const cacheClients = useCallback((clients: ClientVisit[]) => {
    const cacheKey = createCacheKey(CLIENTS_CACHE_KEY);
    dataCache.set(cacheKey, clients, { expireAfter: CACHE_DURATION });
    setClientData(clients);
  }, []);
  
  const invalidateCache = useCallback(() => {
    const cacheKey = createCacheKey(CLIENTS_CACHE_KEY);
    dataCache.invalidate(cacheKey);
  }, []);
  
  return {
    clientData,
    setClientData,
    getCachedClients,
    cacheClients,
    invalidateCache
  };
};
