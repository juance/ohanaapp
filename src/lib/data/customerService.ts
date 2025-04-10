
import { supabase } from '@/integrations/supabase/client';
import { Customer, ClientVisit } from '@/lib/types';
import { formatPhoneNumber } from './customer/phoneUtils';
import { logError } from '@/lib/errorService';
import { updateCustomerLastVisit } from './customer/customerStorageService';
import { getCustomerValetCount, updateValetsCount, useFreeValet } from './customer/valetService';

// Get or create a customer by phone number
export const getCustomerByPhone = async (phoneNumber: string, customerName: string = ''): Promise<Customer | null> => {
  try {
    // Format phone number
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    // Check if customer exists
    const { data: existingCustomer, error: searchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', formattedPhone)
      .maybeSingle();
    
    if (searchError) throw searchError;
    
    // If customer exists, return it
    if (existingCustomer) {
      return {
        id: existingCustomer.id,
        name: existingCustomer.name,
        phone: existingCustomer.phone,
        phoneNumber: existingCustomer.phone, // Add for backwards compatibility
        loyaltyPoints: existingCustomer.loyalty_points || 0,
        valetsCount: existingCustomer.valets_count || 0,
        freeValets: existingCustomer.free_valets || 0,
        valetsRedeemed: existingCustomer.valets_redeemed || 0,
        lastVisit: existingCustomer.last_visit,
        createdAt: existingCustomer.created_at
      };
    }
    
    // If customer does not exist and we have a name, create it
    if (customerName.trim()) {
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
          name: customerName.trim(),
          phone: formattedPhone,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0,
          valets_redeemed: 0
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      if (newCustomer) {
        return {
          id: newCustomer.id,
          name: newCustomer.name,
          phone: newCustomer.phone,
          phoneNumber: newCustomer.phone, // Add for backwards compatibility
          loyaltyPoints: newCustomer.loyalty_points || 0,
          valetsCount: newCustomer.valets_count || 0,
          freeValets: newCustomer.free_valets || 0,
          valetsRedeemed: newCustomer.valets_redeemed || 0,
          lastVisit: newCustomer.last_visit,
          createdAt: newCustomer.created_at
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCustomerByPhone:', error);
    logError(error, { context: 'getCustomerByPhone' });
    return null;
  }
};

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

// Update customer loyalty points
export const addLoyaltyPoints = async (customerId: string, points: number): Promise<number> => {
  try {
    // First, get current loyalty points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    const newPoints = currentPoints + points;
    
    // Update loyalty points
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: newPoints })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return newPoints;
  } catch (error) {
    console.error('Error in addLoyaltyPoints:', error);
    logError(error, { context: 'addLoyaltyPoints' });
    return 0;
  }
};

// Redeem loyalty points for a reward
export const redeemLoyaltyPoints = async (customerId: string, pointsToRedeem: number): Promise<boolean> => {
  try {
    // First, get current loyalty points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer?.loyalty_points || 0;
    
    // Ensure customer has enough points
    if (currentPoints < pointsToRedeem) {
      return false;
    }
    
    const newPoints = currentPoints - pointsToRedeem;
    
    // Update loyalty points
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: newPoints })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error in redeemLoyaltyPoints:', error);
    logError(error, { context: 'redeemLoyaltyPoints' });
    return false;
  }
};

// Re-export necessary functions from sub-modules
export { 
  updateCustomerLastVisit, 
  getCustomerValetCount,
  updateValetsCount,
  useFreeValet
};

// Add a function to store customer data
export const storeCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        phone: customerData.phone || formatPhoneNumber(customerData.phoneNumber || ''),
        loyalty_points: customerData.loyaltyPoints || 0,
        valets_count: customerData.valetsCount || 0,
        free_valets: customerData.freeValets || 0
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      phoneNumber: data.phone, // Add for backwards compatibility
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      lastVisit: data.last_visit,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    logError(error, { context: 'storeCustomer' });
    return null;
  }
};

// Add the missing updateLoyaltyPoints function
export const updateLoyaltyPoints = async (customerId: string, points: number): Promise<number> => {
  return addLoyaltyPoints(customerId, points);
};
