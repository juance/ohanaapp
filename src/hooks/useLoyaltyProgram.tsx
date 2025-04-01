
import { useState } from 'react';
import { ClientVisit } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
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
    
    // Load full client data including loyalty points
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
      const success = await addLoyaltyPoints(selectedClient.id, pointsToAdd);
      
      if (success) {
        toast.success(`${pointsToAdd} puntos añadidos a ${selectedClient.clientName}`);
        
        // Update selected client
        setSelectedClient({
          ...selectedClient,
          loyaltyPoints: (selectedClient.loyaltyPoints || 0) + pointsToAdd
        });
        
        setPointsToAdd(0);
        await refreshData();
      } else {
        throw new Error("No se pudieron agregar los puntos");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al agregar puntos");
    } finally {
      setIsAddingPoints(false);
    }
  };
  
  const handleRedeemPoints = async () => {
    if (!selectedClient || !selectedClient.loyaltyPoints || pointsToRedeem <= 0 || pointsToRedeem > selectedClient.loyaltyPoints) {
      toast.error("La cantidad de puntos a canjear no es válida");
      return;
    }
    
    try {
      const success = await redeemLoyaltyPoints(selectedClient.id, pointsToRedeem);
      
      if (success) {
        toast.success(`${pointsToRedeem} puntos canjeados de ${selectedClient.clientName}`);
        
        // Update selected client
        setSelectedClient({
          ...selectedClient,
          loyaltyPoints: selectedClient.loyaltyPoints - pointsToRedeem
        });
        
        setPointsToRedeem(0);
        await refreshData();
      } else {
        throw new Error("No se pudieron canjear los puntos");
      }
    } catch (err: any) {
      toast.error(err.message || "Error al canjear puntos");
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
