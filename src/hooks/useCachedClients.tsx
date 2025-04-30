
import { useState, useEffect } from 'react';
import { ClientVisit, Customer, convertCustomerToClientVisit } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { CLIENTS_STORAGE_KEY } from '@/lib/constants/storageKeys';

export const useCachedClients = () => {
  const [clients, setClients] = useState<ClientVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // Try to get clients from local storage first
      const cachedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
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
      const clientVisits = data.map((item: any) => {
        // Map database fields to Customer type
        const customer: Customer = {
          id: item.id,
          name: item.name,
          phone: item.phone,
          phoneNumber: item.phone, // For compatibility
          valetsCount: item.valets_count || 0,
          freeValets: item.free_valets || 0,
          loyaltyPoints: item.loyalty_points || 0,
          lastVisit: item.last_visit || '',
          valetsRedeemed: item.valets_redeemed || 0,
          createdAt: item.created_at
        };
        return convertCustomerToClientVisit(customer);
      });
      
      // Update state and cache
      setClients(clientVisits);
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clientVisits));
      setError(null);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching clients'));
    } finally {
      setIsLoading(false);
    }
  };

  const invalidateCache = () => {
    localStorage.removeItem(CLIENTS_STORAGE_KEY);
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
    refreshClients  // Add this to fix the missing property error
  };
};
