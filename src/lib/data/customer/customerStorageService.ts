
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../../types';

export const storeCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    // Formato de teléfono Argentina: asegurar que comience con +549
    let phoneNumber = customer.phoneNumber;
    if (!phoneNumber.startsWith('+549')) {
      // Si el número ya tiene + al inicio, reemplazarlo
      if (phoneNumber.startsWith('+')) {
        phoneNumber = '+549' + phoneNumber.substring(1);
      } 
      // Si no tiene + al inicio, simplemente agregar +549
      else {
        phoneNumber = '+549' + phoneNumber;
      }
    }

    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: phoneNumber,
        loyalty_points: customer.loyaltyPoints || 0,
        valets_count: 0,
        free_valets: 0
      }])
      .select('*')
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      createdAt: data.created_at,
      lastVisit: data.created_at, // Initialize lastVisit with createdAt
      loyaltyPoints: data.loyalty_points || 0,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0
    };
  } catch (error) {
    console.error('Error storing customer in Supabase:', error);
    return null;
  }
};

// Add the missing updateCustomerLastVisit function
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
    return false;
  }
};
