
import { supabase } from '@/integrations/supabase/client';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { CUSTOMERS_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { v4 as uuidv4 } from 'uuid';

export interface LocalClient {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
  freeValets: number;
  valetsCount: number;
  lastVisit?: string;
  pendingSync: boolean;
}

export const createClient = async (name: string, phone: string): Promise<LocalClient> => {
  try {
    // Try to create in Supabase first
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name,
        phone,
        loyalty_points: 0,
        free_valets: 0,
        valets_count: 0
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating client in Supabase:', error);
      
      // Check if the error is due to unique constraint violation
      if (error.code === '23505') {
        // Retrieve the existing client
        const { data: existingClient, error: fetchError } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', phone)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Return the existing client
        return {
          id: existingClient.id,
          name: existingClient.name,
          phone: existingClient.phone,
          loyaltyPoints: existingClient.loyalty_points || 0,
          freeValets: existingClient.free_valets || 0,
          valetsCount: existingClient.valets_count || 0,
          lastVisit: existingClient.last_visit,
          pendingSync: false
        };
      }
      
      // If it's a different error, create locally
      const client: LocalClient = {
        id: uuidv4(),
        name,
        phone,
        loyaltyPoints: 0,
        freeValets: 0,
        valetsCount: 0,
        pendingSync: true
      };
      
      // Get existing clients
      const existingClients = getFromLocalStorage<LocalClient[]>(CUSTOMERS_STORAGE_KEY) || [];
      
      // Check if the client already exists locally
      const existingClientIndex = existingClients.findIndex(c => c.phone === phone);
      
      if (existingClientIndex >= 0) {
        // Update existing client
        existingClients[existingClientIndex].name = name;
        existingClients[existingClientIndex].pendingSync = true;
        
        // Save back to local storage
        saveToLocalStorage(CUSTOMERS_STORAGE_KEY, existingClients);
        
        return existingClients[existingClientIndex];
      }
      
      // Add new client
      existingClients.push(client);
      
      // Save back to local storage
      saveToLocalStorage(CUSTOMERS_STORAGE_KEY, existingClients);
      
      return client;
    }
    
    // If created successfully in Supabase, return the client
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      loyaltyPoints: data.loyalty_points || 0,
      freeValets: data.free_valets || 0,
      valetsCount: data.valets_count || 0,
      lastVisit: data.last_visit,
      pendingSync: false
    };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const getClientByPhone = async (phone: string): Promise<LocalClient | null> => {
  try {
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();
      
    if (error) throw error;
    
    // Return the client
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      loyaltyPoints: data.loyalty_points || 0,
      freeValets: data.free_valets || 0,
      valetsCount: data.valets_count || 0,
      lastVisit: data.last_visit,
      pendingSync: false
    };
  } catch (error) {
    console.error('Error getting client from Supabase:', error);
    
    // Fallback to local storage
    const localClients = getFromLocalStorage<LocalClient[]>(CUSTOMERS_STORAGE_KEY) || [];
    
    // Find client by phone
    const client = localClients.find(c => c.phone === phone);
    
    return client || null;
  }
};
