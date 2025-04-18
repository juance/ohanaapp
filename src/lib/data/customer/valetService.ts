
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '../coreUtils';
import { CLIENTS_STORAGE_KEY } from '@/lib/constants/storageKeys';
import { toast } from '@/lib/toast';

// Get customer valet count
export const getCustomerValetCount = async (customerId: string): Promise<{ valetsCount: number; freeValets: number; hasResetDate: boolean }> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();
    
    if (error) throw error;
    
    // Check if the customer has a last reset date
    // Handle case where last_reset_date might not exist in the database
    let hasResetDate = false;
    try {
      const { data: resetData } = await supabase
        .from('customers')
        .select('last_reset_date')
        .eq('id', customerId)
        .single();
      
      hasResetDate = resetData && typeof resetData.last_reset_date !== 'undefined' && resetData.last_reset_date !== null;
    } catch (resetError) {
      console.error('Error checking for last_reset_date:', resetError);
      // Continue without reset date information
    }
    
    return {
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      hasResetDate
    };
  } catch (error) {
    console.error('Error in getCustomerValetCount:', error);
    return { valetsCount: 0, freeValets: 0, hasResetDate: false };
  }
};

// Update customer valets count
export const updateValetsCount = async (customerId: string, incrementBy: number = 1): Promise<boolean> => {
  try {
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentValets = customer?.valets_count || 0;
    const newValetsCount = currentValets + incrementBy;
    
    const { error: updateError } = await supabase
      .from('customers')
      .update({ valets_count: newValetsCount })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error in updateValetsCount:', error);
    return false;
  }
};

// Use a free valet
export const useFreeValet = async (customerId: string): Promise<boolean> => {
  try {
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('free_valets, valets_redeemed')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentFreeValets = customer?.free_valets || 0;
    
    if (currentFreeValets <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El cliente no tiene valets gratis disponibles"
      });
      return false;
    }
    
    const currentValetsRedeemed = customer?.valets_redeemed || 0;
    const newFreeValets = currentFreeValets - 1;
    const newValetsRedeemed = currentValetsRedeemed + 1;
    
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        free_valets: newFreeValets,
        valets_redeemed: newValetsRedeemed
      })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    toast({
      title: "Valet gratis utilizado",
      description: `Quedan ${newFreeValets} valets gratis`
    });
    
    return true;
  } catch (error) {
    console.error('Error in useFreeValet:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Error al utilizar el valet gratis"
    });
    return false;
  }
};

// Get locally stored customers
interface LocalClient extends Customer {
  pendingSync?: boolean;
  last_reset_date?: string;
}

// Check and update customer free valets
export const checkAndUpdateFreeValets = async (customerId: string): Promise<{ updated: boolean; newFreeValets: number }> => {
  try {
    // Get customer data
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('valets_count, free_valets, last_reset_date')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    // Extract values
    const valetsCount = customer?.valets_count || 0;
    const currentFreeValets = customer?.free_valets || 0;
    
    // Convert last reset date if it exists, otherwise use a far past date
    let lastResetDate: Date;
    if (customer && customer.last_reset_date) {
      lastResetDate = new Date(customer.last_reset_date as string);
    } else {
      lastResetDate = new Date(0); // Jan 1, 1970
    }
    
    const now = new Date();
    const monthDiff = (now.getFullYear() - lastResetDate.getFullYear()) * 12 + 
                     (now.getMonth() - lastResetDate.getMonth());
    
    // If it's been more than a month since the last reset, update free valets
    if (monthDiff >= 1) {
      // Calculate free valets: 1 free per 10 valets
      const freeValetsEarned = Math.floor(valetsCount / 10);
      
      // Update database
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          free_valets: currentFreeValets + freeValetsEarned,
          last_reset_date: now.toISOString()
        })
        .eq('id', customerId);
      
      if (updateError) throw updateError;
      
      // If free valets were earned, show toast
      if (freeValetsEarned > 0) {
        toast({
          title: "Valets gratis actualizados",
          description: `El cliente ha ganado ${freeValetsEarned} valets gratis`
        });
      }
      
      return {
        updated: true,
        newFreeValets: currentFreeValets + freeValetsEarned
      };
    }
    
    return {
      updated: false,
      newFreeValets: currentFreeValets
    };
  } catch (error) {
    console.error('Error in checkAndUpdateFreeValets:', error);
    return {
      updated: false,
      newFreeValets: 0
    };
  }
};

// Ensure all customers have a last_reset_date value
export const ensureCustomerResetDates = async (): Promise<number> => {
  try {
    // Get all customers without a last_reset_date
    const { data, error } = await supabase
      .from('customers')
      .select('id, last_reset_date')
      .is('last_reset_date', null);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return 0; // No customers to update
    }
    
    const now = new Date().toISOString();
    let updatedCount = 0;
    
    // Update each customer with a default last_reset_date
    for (const customer of data) {
      const { error: updateError } = await supabase
        .from('customers')
        .update({ last_reset_date: now })
        .eq('id', customer.id);
      
      if (!updateError) {
        updatedCount++;
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error('Error in ensureCustomerResetDates:', error);
    return 0;
  }
};

// Helper to convert a customer record to a LocalClient
export const convertToLocalClient = (customer: any): LocalClient => {
  return {
    id: customer.id,
    clientId: customer.id,
    clientName: customer.name || '',
    phoneNumber: customer.phone || '',
    loyaltyPoints: customer.loyalty_points || 0,
    freeValets: customer.free_valets || 0,
    valetsCount: customer.valets_count || 0,
    lastVisit: customer.last_visit || new Date().toISOString(),
    last_reset_date: customer.last_reset_date ? String(customer.last_reset_date) : undefined,
    pendingSync: false
  };
};
