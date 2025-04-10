
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../../types';
import { formatPhoneNumber } from './phoneUtils';
import { logError } from '@/lib/errorService';

export const storeCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    // Format phone number for storage
    const phoneNumber = formatPhoneNumber(customer.phone || customer.phoneNumber || '');
    
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: phoneNumber,
        loyalty_points: customer.loyaltyPoints || 0,
        valets_count: customer.valetsCount || 0,
        free_valets: customer.freeValets || 0,
        valets_redeemed: customer.valetsRedeemed || 0
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      phone: data.phone,
      phoneNumber: data.phone, // Add phoneNumber for compatibility
      createdAt: data.created_at,
      lastVisit: data.created_at, // Initialize lastVisit with createdAt
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      valetsRedeemed: data.valets_redeemed || 0
    };
  } catch (error) {
    console.error('Error storing customer in Supabase:', error);
    logError(error, { context: 'storeCustomer' });
    return null;
  }
};

export const updateCustomerLastVisit = async (customerId: string): Promise<boolean> => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('customers')
      .update({ last_visit: now })
      .eq('id', customerId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating customer last visit:', error);
    logError(error, { context: 'updateCustomerLastVisit' });
    return false;
  }
};
