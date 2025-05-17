
import { Customer } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { storeCustomer, getStoredCustomers } from '@/lib/data/customer/customerLocalStorage';
import { storeOrUpdateCustomer } from '@/lib/data/customer/customerManager';

export async function getCustomerByPhone(phoneNumber: string): Promise<Customer | null> {
  try {
    // First try to get from database
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (error) {
      console.error('Error fetching customer from database:', error);
      // If there was an error, check local storage as fallback
      const localCustomers = getStoredCustomers();
      const localCustomer = localCustomers.find(c => 
        c.phone === phoneNumber || c.phoneNumber === phoneNumber
      );
      return localCustomer || null;
    }

    if (data) {
      // Also store in local storage for offline access
      const customer: Customer = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        phoneNumber: data.phone,
        loyaltyPoints: data.loyalty_points || 0,
        valetsCount: data.valets_count || 0,
        freeValets: data.free_valets || 0,
        lastVisit: data.last_visit,
        valetsRedeemed: data.valets_redeemed || 0,
        createdAt: data.created_at
      };

      storeOrUpdateCustomer(customer);
      return customer;
    }

    return null;
  } catch (error) {
    console.error('Error in getCustomerByPhone:', error);
    return null;
  }
}

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching customers from database:', error);
      // Return local storage data as fallback
      return getStoredCustomers();
    }

    const customers: Customer[] = data.map(item => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      phoneNumber: item.phone,
      loyaltyPoints: item.loyalty_points || 0,
      valetsCount: item.valets_count || 0,
      freeValets: item.free_valets || 0,
      lastVisit: item.last_visit,
      valetsRedeemed: item.valets_redeemed || 0,
      createdAt: item.created_at
    }));

    // Update local storage
    customers.forEach(customer => {
      storeOrUpdateCustomer(customer);
    });

    return customers;
  } catch (error) {
    console.error('Error in getAllCustomers:', error);
    return getStoredCustomers();
  }
}

export async function createOrUpdateCustomer(customer: Partial<Customer>): Promise<Customer | null> {
  try {
    if (!customer.phone && !customer.phoneNumber) {
      throw new Error('Phone number is required');
    }

    const phoneToUse = customer.phone || customer.phoneNumber || '';

    // Check if customer exists
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phoneToUse)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if customer exists:', fetchError);
      // Use local storage as fallback
      return storeOrUpdateCustomer(customer);
    }

    if (existingCustomer) {
      // Update existing customer
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          name: customer.name || existingCustomer.name,
          loyalty_points: customer.loyaltyPoints ?? existingCustomer.loyalty_points,
          valets_count: customer.valetsCount ?? existingCustomer.valets_count,
          free_valets: customer.freeValets ?? existingCustomer.free_valets,
          last_visit: customer.lastVisit || new Date().toISOString(),
          valets_redeemed: customer.valetsRedeemed ?? existingCustomer.valets_redeemed
        })
        .eq('id', existingCustomer.id);

      if (updateError) {
        console.error('Error updating customer in database:', updateError);
        // Use local storage as fallback
        return storeOrUpdateCustomer({
          ...customer,
          id: existingCustomer.id
        });
      }

      const updatedCustomer: Customer = {
        id: existingCustomer.id,
        name: customer.name || existingCustomer.name || '',
        phone: phoneToUse,
        phoneNumber: phoneToUse,
        loyaltyPoints: customer.loyaltyPoints ?? existingCustomer.loyalty_points ?? 0,
        valetsCount: customer.valetsCount ?? existingCustomer.valets_count ?? 0,
        freeValets: customer.freeValets ?? existingCustomer.free_valets ?? 0,
        lastVisit: customer.lastVisit || existingCustomer.last_visit,
        valetsRedeemed: customer.valetsRedeemed ?? existingCustomer.valets_redeemed ?? 0,
        createdAt: existingCustomer.created_at
      };

      // Update local storage
      storeOrUpdateCustomer(updatedCustomer);
      return updatedCustomer;
    } else {
      // Create new customer
      const newCustomer = {
        name: customer.name || '',
        phone: phoneToUse,
        loyalty_points: customer.loyaltyPoints || 0,
        valets_count: customer.valetsCount || 0,
        free_valets: customer.freeValets || 0,
        valets_redeemed: customer.valetsRedeemed || 0,
        last_visit: customer.lastVisit || new Date().toISOString()
      };

      const { data: insertedCustomer, error: insertError } = await supabase
        .from('customers')
        .insert(newCustomer)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating customer in database:', insertError);
        // Use local storage as fallback
        return storeOrUpdateCustomer(customer);
      }

      const createdCustomer: Customer = {
        id: insertedCustomer.id,
        name: insertedCustomer.name,
        phone: insertedCustomer.phone,
        phoneNumber: insertedCustomer.phone,
        loyaltyPoints: insertedCustomer.loyalty_points || 0,
        valetsCount: insertedCustomer.valets_count || 0,
        freeValets: insertedCustomer.free_valets || 0,
        lastVisit: insertedCustomer.last_visit,
        valetsRedeemed: insertedCustomer.valets_redeemed || 0,
        createdAt: insertedCustomer.created_at
      };

      // Update local storage
      storeOrUpdateCustomer(createdCustomer);
      return createdCustomer;
    }
  } catch (error) {
    console.error('Error in createOrUpdateCustomer:', error);
    // Use local storage as fallback
    return storeOrUpdateCustomer(customer);
  }
}
