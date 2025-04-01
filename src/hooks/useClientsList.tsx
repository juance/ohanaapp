
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClientData } from './useClientData';
import { ClientVisit } from '@/lib/types';
import { formatPhoneNumber } from '@/lib/data/customer/phoneUtils';
import { toast } from 'sonner';
import { exportClientsToCSV } from '@/lib/exportUtils';

export const useClientsList = () => {
  const { toast: uiToast } = useToast();
  const { frequentClients, refreshData, loading, error } = useClientData();
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState<string | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientNotes, setClientNotes] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Pagination settings
  const itemsPerPage = 10;

  // Filter clients based on search query
  const filteredClients = searchQuery.trim() === '' 
    ? frequentClients 
    : frequentClients.filter(client => {
        const query = searchQuery.toLowerCase().trim();
        return (
          client.clientName.toLowerCase().includes(query) || 
          client.phoneNumber.includes(query)
        );
      });

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  
  // Ensure current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Get current page clients
  const currentClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

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

  const handleSaveClient = async (id: string) => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const loadClientNotes = useCallback(async (clientId: string) => {
    setIsLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('notes')
        .eq('id', clientId)
        .single();
        
      if (error) throw error;
      
      setClientNotes(data?.notes || '');
    } catch (err) {
      console.error("Error loading client notes:", err);
      setClientNotes('');
      toast.error("No se pudieron cargar las notas del cliente");
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  const saveClientNotes = async (notes: string) => {
    if (!selectedClient) {
      toast.error("No hay cliente seleccionado");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ notes })
        .eq('id', selectedClient.id);
        
      if (error) throw error;
      
      setClientNotes(notes);
      toast.success("Notas guardadas correctamente");
    } catch (err) {
      console.error("Error saving client notes:", err);
      toast.error("Error al guardar las notas del cliente");
      throw err;
    }
  };

  // Export clients data to CSV
  const handleExportClients = async () => {
    try {
      setIsExporting(true);
      
      // Use all filtered clients, not just current page
      exportClientsToCSV(filteredClients);
      
      toast.success("Datos exportados correctamente", {
        description: "El archivo CSV ha sido generado"
      });
    } catch (err) {
      console.error("Error exporting client data:", err);
      toast.error("Error al exportar datos", {
        description: "No se pudieron exportar los datos del cliente"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Selected client state
  const [selectedClient, setSelectedClient] = useState<ClientVisit | null>(null);
  
  const handleSelectClient = async (client: ClientVisit) => {
    setSelectedClient(client);
    await loadClientNotes(client.id);
  };

  return {
    filteredClients,
    currentClients,
    totalPages,
    currentPage,
    loading,
    error,
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
    searchQuery,
    setSearchQuery,
    clientNotes,
    isLoadingNotes,
    selectedClient,
    isExporting,
    handleAddClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    handleSearchChange,
    handlePageChange,
    handleSelectClient,
    saveClientNotes,
    handleExportClients,
    refreshData
  };
};
