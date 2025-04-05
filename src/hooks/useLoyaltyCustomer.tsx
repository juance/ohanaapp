
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';

export interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  loyalty_points: number;
  free_valets: number;
  valets_count: number;
  valets_redeemed: number | null;
}

export function useLoyaltyCustomer() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<LoyaltyCustomer | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const handleSearch = async () => {
    if (!phone || phone.length < 8) {
      toast.error('Por favor ingrese un número de teléfono válido');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) throw error;

      if (data) {
        setSearchResult(data as LoyaltyCustomer);
      } else {
        toast.error('Cliente no encontrado');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching for customer:', error);
      toast.error('Error al buscar cliente');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemValet = async () => {
    if (!searchResult) return;

    setRedeeming(true);
    try {
      // Update customer's free_valets count
      const { error } = await supabase
        .from('customers')
        .update({
          free_valets: searchResult.free_valets + 1,
          loyalty_points: Math.max(0, searchResult.loyalty_points - 100), // Subtract 100 points
          valets_redeemed: (searchResult.valets_redeemed || 0) + 1
        })
        .eq('id', searchResult.id);

      if (error) throw error;

      toast.success('¡Valet gratis canjeado con éxito!');

      // Refresh customer data
      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', searchResult.id)
        .single();

      if (fetchError) throw fetchError;
      setSearchResult(data as LoyaltyCustomer);

    } catch (error) {
      console.error('Error redeeming free valet:', error);
      toast.error('Error al canjear valet gratis');
    } finally {
      setRedeeming(false);
    }
  };

  return {
    phone,
    setPhone,
    loading,
    searchResult,
    redeeming,
    handleSearch,
    handleRedeemValet
  };
}
