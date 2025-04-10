
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '@/lib/types';
import { formatPhoneNumber } from './phoneUtils';
import { logError } from '@/lib/errorService';
import { updateCustomerLastVisit } from './customerStorageService';
import { getCustomerValetCount, updateValetsCount, useFreeValet } from './valetService';
import { addLoyaltyPoints, redeemLoyaltyPoints } from './loyaltyService';

// Get frequent clients for dashboard
export const getFrequentClients = async (limit: number = 5): Promise<ClientVisit[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('valets_count', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(customer => ({
      id: customer.id,
      clientId: customer.id,
      phoneNumber: customer.phone,
      clientName: customer.name || 'Cliente',
      visitCount: customer.valets_count || 0,
      lastVisit: customer.last_visit,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      loyaltyPoints: customer.loyalty_points || 0
    }));
  } catch (error) {
    console.error('Error in getFrequentClients:', error);
    logError(error, { context: 'getFrequentClients' });
    return [];
  }
};

// Re-export necessary functions from sub-modules
export { 
  updateCustomerLastVisit, 
  getCustomerValetCount,
  updateValetsCount,
  useFreeValet,
  addLoyaltyPoints,
  redeemLoyaltyPoints
};

// Explicitly export convenience aliases for common functions
export { updateLoyaltyPoints } from './loyaltyService';
export { getCustomerByPhone } from './customerRetrievalService';
export { storeCustomer } from './customerStorageService';
