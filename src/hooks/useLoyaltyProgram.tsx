import { useState } from 'react';
import { ClientVisit } from '@/lib/types';
import { toast } from '@/lib/toast';
import { addLoyaltyPoints, redeemLoyaltyPoints } from '@/lib/dataService';
import { supabase } from '@/integrations/supabase/client';

export const useLoyaltyProgram = (refreshData: () => Promise<void>) => {
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [isAddingPoints, setIsAddingPoints] = useState(false);

  const handleSelectClient = async (client: ClientVisit) => {
    setSelectedClient(client);
    setPointsToAdd(0);
    setPointsToRedeem(0);

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('loyalty_points, free_valets, valets_count')
        .eq('id', client.id)
        .single();

      if (error) throw error;

      setSelectedClient({
        ...client,
        loyaltyPoints: data.loyalty_points,
        freeValets: data.free_valets,
        valetsCount: data.valets_count
      });
    } catch (err) {
      console.error("Error loading client details:", err);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedClient || pointsToAdd <= 0) return;

    setIsAddingPoints(true);
    try {
      // Get current loyalty points
      const { data: customer, error: getError } = await supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', selectedClient.id)
        .single();

      if (getError) throw getError;

      const currentPoints = customer?.loyalty_points || 0;
      const newPoints = currentPoints + pointsToAdd;

      // Update loyalty points
      const { error: updateError } = await supabase
        .from('customers')
        .update({ loyalty_points: newPoints })
        .eq('id', selectedClient.id);

      if (updateError) throw updateError;

      toast({
        title: "Puntos agregados",
        description: `${pointsToAdd} puntos añadidos a ${selectedClient.clientName}`,
      });

      setSelectedClient({
        ...selectedClient,
        loyaltyPoints: newPoints
      });

      setPointsToAdd(0);
      await refreshData();
    } catch (err: any) {
      console.error('Error adding loyalty points:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al agregar puntos",
      });
    } finally {
      setIsAddingPoints(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!selectedClient || !selectedClient.loyaltyPoints || pointsToRedeem <= 0 || pointsToRedeem > selectedClient.loyaltyPoints) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La cantidad de puntos a canjear no es válida",
      });
      return;
    }

    try {
      // Get current loyalty points
      const { data: customer, error: getError } = await supabase
        .from('customers')
        .select('loyalty_points, free_valets')
        .eq('id', selectedClient.id)
        .single();

      if (getError) throw getError;

      const currentPoints = customer?.loyalty_points || 0;
      const currentFreeValets = customer?.free_valets || 0;

      // Ensure customer has enough points
      if (currentPoints < pointsToRedeem) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay suficientes puntos para canjear",
        });
        return;
      }

      // Calculate new values
      const newPoints = currentPoints - pointsToRedeem;
      const newFreeValets = currentFreeValets + Math.floor(pointsToRedeem / 100);

      // Update loyalty points and free valets
      const { error: updateError } = await supabase
        .from('customers')
        .update({
          loyalty_points: newPoints,
          free_valets: newFreeValets
        })
        .eq('id', selectedClient.id);

      if (updateError) throw updateError;

      toast({
        title: "Puntos canjeados",
        description: `${pointsToRedeem} puntos canjeados de ${selectedClient.clientName}`,
      });

      setSelectedClient({
        ...selectedClient,
        loyaltyPoints: newPoints,
        freeValets: newFreeValets
      });

      setPointsToRedeem(0);
      await refreshData();
    } catch (err: any) {
      console.error('Error redeeming loyalty points:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al canjear puntos",
      });
    }
  };

  return {
    selectedClient,
    pointsToAdd,
    setPointsToAdd,
    pointsToRedeem,
    setPointsToRedeem,
    isAddingPoints,
    handleSelectClient,
    handleAddPoints,
    handleRedeemPoints
  };
};
