
import { supabase } from '@/integrations/supabase/client';
import { Customer } from './types';

export const storeCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: customer.phoneNumber,
        loyalty_points: 0 // Inicializar puntos de fidelidad en 0
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
      loyaltyPoints: data.loyalty_points || 0
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
    
    // If customer exists, get their last visit from tickets
    if (data) {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('created_at')
        .eq('customer_id', data.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      let lastVisit = data.created_at;
      if (!ticketError && ticketData && ticketData.length > 0) {
        lastVisit = ticketData[0].created_at;
      }
      
      return {
        id: data.id,
        name: data.name,
        phoneNumber: data.phone,
        createdAt: data.created_at,
        lastVisit,
        loyaltyPoints: data.loyalty_points || 0
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving customer from Supabase:', error);
    return null;
  }
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    // First get all customers
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .order('name');
    
    if (customersError) throw customersError;
    
    // For each customer, get their last visit
    const customersWithLastVisit = await Promise.all(
      customersData.map(async (customer) => {
        const { data: ticketData, error: ticketError } = await supabase
          .from('tickets')
          .select('created_at')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        let lastVisit = customer.created_at;
        if (!ticketError && ticketData && ticketData.length > 0) {
          lastVisit = ticketData[0].created_at;
        }
        
        return {
          id: customer.id,
          name: customer.name,
          phoneNumber: customer.phone,
          createdAt: customer.created_at,
          lastVisit,
          loyaltyPoints: customer.loyalty_points || 0
        };
      })
    );
    
    return customersWithLastVisit;
  } catch (error) {
    console.error('Error retrieving all customers from Supabase:', error);
    return [];
  }
};

export const addLoyaltyPoints = async (customerId: string, points: number): Promise<boolean> => {
  try {
    // First get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer.loyalty_points || 0;
    
    // Update with new points total
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: currentPoints + points })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error adding loyalty points:', error);
    return false;
  }
};

export const redeemLoyaltyPoints = async (customerId: string, points: number): Promise<boolean> => {
  try {
    // First get current points
    const { data: customer, error: getError } = await supabase
      .from('customers')
      .select('loyalty_points')
      .eq('id', customerId)
      .single();
    
    if (getError) throw getError;
    
    const currentPoints = customer.loyalty_points || 0;
    
    // Ensure customer has enough points
    if (currentPoints < points) {
      return false;
    }
    
    // Update with new points total
    const { error: updateError } = await supabase
      .from('customers')
      .update({ loyalty_points: currentPoints - points })
      .eq('id', customerId);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error);
    return false;
  }
};
