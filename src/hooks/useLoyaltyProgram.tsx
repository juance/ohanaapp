
import { useState } from 'react';
import { Customer } from '@/lib/types';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';

export const useLoyaltyProgram = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Add loyalty points to a customer
  const addPoints = async (customer: Customer, points: number): Promise<number> => {
    try {
      setLoading(true);
      setError(null);

      if (!customer || !customer.id) {
        throw new Error('Customer information is incomplete');
      }

      if (points <= 0) {
        throw new Error('Points must be greater than 0');
      }

      // Update customer loyalty points directly in Supabase
      const { data, error: updateError } = await supabase
        .from('customers')
        .update({
          loyalty_points: (customer.loyaltyPoints || 0) + points
        })
        .eq('id', customer.id)
        .select('loyalty_points')
        .single();

      if (updateError) throw updateError;
      
      const newPoints = data?.loyalty_points || customer.loyaltyPoints + points;
      
      toast.success(`Se han agregado ${points} puntos de fidelidad`);
      return newPoints;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar puntos';
      console.error('Error adding loyalty points:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Redeem loyalty points for free valets
  const redeemPoints = async (
    customer: Customer,
    pointsToRedeem: number,
    valetsToAdd: number = 1
  ): Promise<{ remainingPoints: number, freeValets: number }> => {
    try {
      setLoading(true);
      setError(null);

      if (!customer || !customer.id) {
        throw new Error('Customer information is incomplete');
      }

      if (pointsToRedeem <= 0) {
        throw new Error('Points must be greater than 0');
      }

      if ((customer.loyaltyPoints || 0) < pointsToRedeem) {
        throw new Error('Customer does not have enough points');
      }

      // Update customer loyalty points and free valets directly in Supabase
      const { data, error: updateError } = await supabase
        .from('customers')
        .update({
          loyalty_points: (customer.loyaltyPoints || 0) - pointsToRedeem,
          free_valets: (customer.freeValets || 0) + valetsToAdd
        })
        .eq('id', customer.id)
        .select('loyalty_points, free_valets')
        .single();

      if (updateError) throw updateError;
      
      const result = {
        remainingPoints: data?.loyalty_points || customer.loyaltyPoints - pointsToRedeem,
        freeValets: data?.free_valets || customer.freeValets + valetsToAdd
      };
      
      toast.success(`Se han canjeado ${pointsToRedeem} puntos por ${valetsToAdd} valet gratis`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al canjear puntos';
      console.error('Error redeeming loyalty points:', err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addPoints,
    redeemPoints,
    loading,
    error
  };
};
