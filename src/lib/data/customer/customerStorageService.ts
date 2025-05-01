import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/lib/types';

// Get all customers
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) throw error;

    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      phoneNumber: customer.phone,
      phone: customer.phone,
      lastVisit: customer.last_visit,
      valetsCount: customer.valets_count || 0,
      freeValets: customer.free_valets || 0,
      loyaltyPoints: customer.loyalty_points || 0,
      createdAt: customer.created_at,
      valetsRedeemed: customer.valets_redeemed || 0
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Get customer by phone number
export const getCustomerByPhone = async (phone: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      phoneNumber: data.phone,
      phone: data.phone,
      valetsCount: data.valets_count || 0,
      freeValets: data.free_valets || 0,
      lastVisit: data.last_visit,
      loyaltyPoints: data.loyalty_points || 0,
      createdAt: data.created_at,
      valetsRedeemed: data.valets_redeemed || 0
    };
  } catch (error) {
    console.error('Error fetching customer by phone:', error);
    return null;
  }
};

// Add a new customer
export const addCustomer = async (
  name: string,
  phoneNumber: string,
  loyaltyPoints: number = 0,
  valetsCount: number = 0,
  freeValets: number = 0,
  lastVisit: string = new Date().toISOString()
): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([
        {
          id: uuidv4(),
          name,
          phone: phoneNumber,
          loyalty_points: loyaltyPoints,
          valets_count: valetsCount,
          free_valets: freeValets,
          created_at: new Date().toISOString(),
          last_visit: lastVisit
        }
      ])
      .select();

    if (error) throw error;

    if (data && data[0]) {
      return mapCustomerFromDb(data[0]);
    }

    return null;
  } catch (error) {
    console.error('Error adding customer:', error);
    return null;
  }
};

// Update an existing customer
export const updateCustomer = async (
  id: string,
  name: string,
  phoneNumber: string,
  loyaltyPoints: number,
  valetsCount: number,
  freeValets: number,
  lastVisit: string
): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        name,
        phone: phoneNumber,
        loyalty_points: loyaltyPoints,
        valets_count: valetsCount,
        free_valets: freeValets,
        last_visit: lastVisit
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data && data[0]) {
      return mapCustomerFromDb(data[0]);
    }

    return null;
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
};

export const mapCustomerFromDb = (data: any): Customer => {
  return {
    id: data.id,
    name: data.name,
    phoneNumber: data.phone,
    phone: data.phone,
    loyaltyPoints: data.loyalty_points,
    valetsCount: data.valets_count,
    freeValets: data.free_valets,
    createdAt: data.created_at,
    lastVisit: data.last_visit,
    valetsRedeemed: data.valets_redeemed || 0
  };
};
