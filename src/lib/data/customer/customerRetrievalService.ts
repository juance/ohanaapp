
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '../../types';
import { formatPhoneNumber } from './phoneUtils';
import { logError } from '@/lib/errorService';

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
          phone: customer.phone,
          phoneNumber: customer.phone, // Add for backwards compatibility
          createdAt: customer.created_at,
          lastVisit,
          loyaltyPoints: customer.loyalty_points || 0,
          valetsCount: customer.valets_count || 0,
          freeValets: customer.free_valets || 0,
          valetsRedeemed: customer.valets_redeemed || 0
        };
      })
    );
    
    return customersWithLastVisit;
  } catch (error) {
    console.error('Error retrieving all customers from Supabase:', error);
    return [];
  }
};
