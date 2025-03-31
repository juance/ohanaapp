
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientVisit } from '@/lib/types';
import { formatPhoneNumber } from '@/lib/data/customer/phoneUtils';
import { toast } from 'sonner';

/**
 * Hook for client form operations (add, edit)
 */
export const useClientForm = (refreshData: () => Promise<void>) => {
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');

  const validateClientData = (name: string, phone: string): boolean => {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return false;
    }
    
    if (!phone.trim()) {
      toast.error("El número de teléfono es requerido");
      return false;
    }
    
    // Simple phone validation
    if (!/^[\d+\s()-]{6,15}$/.test(phone.trim())) {
      toast.error("El formato del teléfono no es válido", {
        description: "Por favor, ingrese un número válido"
      });
      return false;
    }
    
    return true;
  };

  const handleAddClient = async () => {
    if (!validateClientData(newClientName, newClientPhone)) {
      return;
    }
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(newClientPhone);
    
    setIsAddingClient(true);
    try {
      // Check if client already exists
      const { data: existingClients, error: checkError } = await supabase
        .from('customers')
        .select('id, name, phone')
        .eq('phone', formattedPhone);
        
      if (checkError) throw checkError;
      
      if (existingClients && existingClients.length > 0) {
        toast.warning("El cliente ya existe", {
          description: `Ya existe un cliente con el teléfono ${formattedPhone}`
        });
        setIsAddingClient(false);
        return;
      }
      
      const { error } = await supabase
        .from('customers')
        .insert({
          name: newClientName,
          phone: formattedPhone,
          loyalty_points: 0,
          valets_count: 0,
          free_valets: 0,
          notes: ""
        });
        
      if (error) throw error;
      
      // Show success message
      toast.success("Cliente agregado", {
        description: "El cliente ha sido agregado exitosamente."
      });
      
      // Refresh data
      await refreshData();
      
      // Clear form
      setNewClientName('');
      setNewClientPhone('');
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast.error("Error al agregar cliente", {
        description: err.message || "Hubo un error al agregar el cliente."
      });
    } finally {
      setIsAddingClient(false);
    }
  };

  const handleEditClient = (client: ClientVisit) => {
    setIsEditingClient(client.id);
    setEditClientName(client.clientName);
    setEditClientPhone(client.phoneNumber);
  };

  const handleSaveClient = async (id: string, selectedClient: ClientVisit | null) => {
    if (!validateClientData(editClientName, editClientPhone)) {
      return;
    }
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(editClientPhone);
    
    try {
      // Check if phone number is already in use by another client
      if (editClientPhone !== selectedClient?.phoneNumber) {
        const { data: existingClients, error: checkError } = await supabase
          .from('customers')
          .select('id')
          .eq('phone', formattedPhone)
          .neq('id', id);
          
        if (checkError) throw checkError;
        
        if (existingClients && existingClients.length > 0) {
          toast.error("Teléfono duplicado", {
            description: "El número de teléfono ya está en uso por otro cliente"
          });
          return;
        }
      }
      
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: formattedPhone
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Cliente actualizado", {
        description: "Los datos del cliente han sido actualizados."
      });
      
      setIsEditingClient(null);
      await refreshData();
    } catch (err: any) {
      toast.error("Error al actualizar cliente", {
        description: err.message || "Error al actualizar el cliente."
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingClient(null);
  };

  return {
    newClientName,
    setNewClientName,
    newClientPhone,
    setNewClientPhone,
    isAddingClient,
    isEditingClient,
    editClientName,
    setEditClientName,
    editClientPhone,
    setEditClientPhone,
    handleAddClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit
  };
};
