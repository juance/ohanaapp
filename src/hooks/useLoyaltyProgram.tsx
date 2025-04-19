
import { useState } from 'react';
import { Customer } from '@/lib/types';
import { toast } from '@/lib/toast';
import { addLoyaltyPoints, redeemLoyaltyPoints } from '@/lib/data/customer/customerService';

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

      const newPoints = await addLoyaltyPoints(customer.id, points);
      
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

      if ((customer.loyalty_points || 0) < pointsToRedeem) {
        throw new Error('Customer does not have enough points');
      }

      const result = await redeemLoyaltyPoints(customer.id, pointsToRedeem, valetsToAdd);
      
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
