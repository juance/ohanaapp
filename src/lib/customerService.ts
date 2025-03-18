
import { supabase } from '@/integrations/supabase/client';
import { Customer } from './types';

export const storeCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: customer.phoneNumber 
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      createdAt: data.created_at
    };
  } catch (error) {
    console.error('Error storing customer in Supabase:', error);
    return null;
  }
};

export const getCustomerByPhone = async (phoneNumber: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();
    
    if (error) throw error;
    
    return data ? {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      createdAt: data.created_at
    } : null;
  } catch (error) {
    console.error('Error retrieving customer from Supabase:', error);
    return null;
  }
};
