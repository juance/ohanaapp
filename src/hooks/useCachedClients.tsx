
import { useState, useEffect } from 'react';
import { ClientVisit, Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { CLIENT_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { logError } from '@/lib/errorService';

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // Try to get clients from local storage first
      const cachedClients = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (cachedClients) {
        setClients(JSON.parse(cachedClients));
      }
      
      // Fetch fresh data from Supabase
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert from database format to ClientVisit format
      const clientVisits: ClientVisit[] = data.map((item: any) => {
        const lastVisitDate = item.last_visit || new Date().toISOString();
        return {
          id: item.id,
          customerId: item.id,
          customerName: item.name,
          phoneNumber: item.phone,
          visitDate: lastVisitDate,
          total: 0,
          isPaid: false,
          clientName: item.name,
          visitCount: item.valets_count || 0,
          lastVisit: item.last_visit,
          lastVisitDate: lastVisitDate,
          loyaltyPoints: item.loyalty_points || 0,
          freeValets: item.free_valets || 0,
          valetsCount: item.valets_count || 0,
          visitFrequency: calculateFrequency(item.last_visit)
        };
      });
      
      // Update state and cache
      setClients(clientVisits);
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clientVisits));
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching clients'));
      await logError(err, { component: 'useCachedClients' });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate visit frequency
  const calculateFrequency = (lastVisit: string | null): string => {
    if (!lastVisit) return 'N/A';
    
    const lastVisitDate = new Date(lastVisit);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'Semanal';
    if (diffDays <= 30) return 'Mensual';
    if (diffDays <= 90) return 'Trimestral';
    return 'Ocasional';
  };

  const invalidateCache = () => {
    localStorage.removeItem(CLIENT_STORAGE_KEY);
  };

  // Function to refresh clients data - for API compatibility
  const refreshClients = fetchClients;
  const refetch = fetchClients;

  useEffect(() => {
    fetchClients();
  }, []);

  return { 
    clients, 
    isLoading, 
    error, 
    refetch,
    invalidateCache,
    refreshClients
  };
};
