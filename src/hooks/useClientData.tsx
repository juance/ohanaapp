
import { useState, useEffect, useCallback } from 'react';
import { getClientVisitFrequency } from '@/lib/dataService';
import { ClientVisit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { dataCache, createCacheKey } from '@/lib/cacheUtils';
import { toast } from 'sonner';

// Cache key for client data
const CLIENTS_CACHE_KEY = 'clients';
// Cache duration - 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

interface UseClientDataReturn {
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  frequentClients: ClientVisit[];
  clients: ClientVisit[];
  refreshData: () => Promise<void>;
}

export const useClientData = (): UseClientDataReturn => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [frequentClients, setFrequentClients] = useState<ClientVisit[]>([]);
  
  const fetchClientData = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first if not forcing refresh
      const cacheKey = createCacheKey(CLIENTS_CACHE_KEY);
      if (!forceRefresh) {
        const cachedData = dataCache.get<ClientVisit[]>(cacheKey, CACHE_DURATION);
        if (cachedData) {
          setFrequentClients(cachedData);
          setLoading(false);
          return;
        }
      }
      
      setLoading(true);
      setError(null);
      
      // Fetch client visit data
      const clients = await getClientVisitFrequency();
      
      try {
        // Get all customers from the database to include loyalty data
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('id, phone, name, loyalty_points, valets_count, free_valets, notes');
          
        if (customersError) throw customersError;
        
        // Enhance client data with default values and loyalty info
        const enhancedClients = clients.map(client => {
          // Find matching customer in database for loyalty information
          const customerMatch = customersData?.find(c => c.phone === client.phoneNumber);
          
          return {
            id: customerMatch?.id || client.id || client.phoneNumber, // Use database ID if available
            phoneNumber: client.phoneNumber,
            clientName: client.clientName,
            visitCount: client.visitCount || 0,
            lastVisit: client.lastVisit || '',
            // Add loyalty information from the database
            valetsCount: customerMatch?.valets_count || 0, 
            freeValets: customerMatch?.free_valets || 0,
            loyaltyPoints: customerMatch?.loyalty_points || 0,
            notes: customerMatch?.notes || '',
            visitFrequency: `${client.visitCount || 0} visits`
          };
        });
        
        // Update state and cache the data
        setFrequentClients(enhancedClients);
        dataCache.set(cacheKey, enhancedClients, { expireAfter: CACHE_DURATION });
      } catch (err) {
        console.error("Error fetching customer loyalty data:", err);
        // Still show clients but without loyalty data
        setFrequentClients(clients.map(client => ({
          ...client,
          valetsCount: 0,
          freeValets: 0,
          loyaltyPoints: 0,
          notes: '',
          visitFrequency: `${client.visitCount || 0} visits`
        })));
        
        // Show toast warning
        toast.warning("No se pudieron cargar los datos de lealtad de clientes", {
          description: "Intente nuevamente más tarde"
        });
      }
    } catch (err) {
      console.error("Error fetching client data:", err);
      setError(err instanceof Error ? err : new Error('Error desconocido al cargar datos de clientes'));
      toast.error("Error al cargar los datos de clientes", {
        description: "Verifique su conexión e intente nuevamente"
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  const refreshData = async () => {
    await fetchClientData(true);
    toast.success("Datos actualizados correctamente");
  };
  
  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);
  
  return {
    loading,
    isLoading: loading,
    error,
    frequentClients,
    clients: frequentClients,
    refreshData
  };
};
