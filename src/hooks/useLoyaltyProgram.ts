
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { Customer } from '@/lib/types';
import { addLoyaltyPoints, redeemLoyaltyPoints } from '@/lib/data/customer/loyaltyService';

export const useLoyaltyProgram = (refreshData: () => Promise<void>) => {
  const [selectedClient, setSelectedClient] = useState<Customer | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [isAddingPoints, setIsAddingPoints] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSelectClient = (client: Customer) => {
    setSelectedClient(client);
  };

  const handleAddPoints = async () => {
    if (!selectedClient || pointsToAdd <= 0) return;
    
    setIsAddingPoints(true);
    setLoading(true);
    
    try {
      await addLoyaltyPoints(selectedClient, pointsToAdd);
      toast.success(`${pointsToAdd} puntos añadidos a ${selectedClient.name}`);
      setPointsToAdd(0);
      await refreshData();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al añadir puntos');
      setError(error);
      toast.error(error.message);
    } finally {
      setIsAddingPoints(false);
      setLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!selectedClient || pointsToRedeem <= 0) return;
    
    setLoading(true);
    
    try {
      await redeemLoyaltyPoints(selectedClient, pointsToRedeem);
      toast.success(`${pointsToRedeem} puntos canjeados`);
      setPointsToRedeem(0);
      await refreshData();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al canjear puntos');
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedClient,
    pointsToAdd,
    setPointsToAdd,
    pointsToRedeem,
    setPointsToRedeem,
    isAddingPoints,
    loading,
    error,
    handleSelectClient,
    handleAddPoints,
    handleRedeemPoints,
    // Métodos originales para compatibilidad con otros componentes
    addPoints: addLoyaltyPoints,
    redeemPoints: redeemLoyaltyPoints
  };
};
