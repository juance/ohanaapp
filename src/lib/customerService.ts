
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
      createdAt: data.created_at,
      lastVisit: data.created_at // Initialize lastVisit with createdAt
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
        lastVisit
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
          lastVisit
        };
      })
    );
    
    return customersWithLastVisit;
  } catch (error) {
    console.error('Error retrieving all customers from Supabase:', error);
    return [];
  }
};
