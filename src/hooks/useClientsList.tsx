
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClientData } from './useClientData';
import { ClientVisit } from '@/lib/types';
import { formatPhoneNumber } from '@/lib/data/customer/phoneUtils';

export const useClientsList = () => {
  const { toast } = useToast();
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

  const handleAddClient = async () => {
    if (!newClientName || !newClientPhone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nombre y teléfono son campos obligatorios.",
      });
      return;
    }
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(newClientPhone);
    
    setIsAddingClient(true);
    try {
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
      toast({
        title: "Cliente agregado",
        description: "El cliente ha sido agregado exitosamente.",
      });
      
      // Refresh data
      await refreshData();
      
      // Clear form
      setNewClientName('');
      setNewClientPhone('');
    } catch (err: any) {
      console.error("Error adding client:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Hubo un error al agregar el cliente.",
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
    // Format phone number
    const formattedPhone = formatPhoneNumber(editClientPhone);
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: editClientName,
          phone: formattedPhone
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados.",
      });
      
      setIsEditingClient(null);
      await refreshData();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Error al actualizar el cliente.",
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
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  const saveClientNotes = async (notes: string) => {
    if (!selectedClient) return;
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({ notes })
        .eq('id', selectedClient.id);
        
      if (error) throw error;
      
      setClientNotes(notes);
    } catch (err) {
      console.error("Error saving client notes:", err);
      throw err;
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
    handleAddClient,
    handleEditClient,
    handleSaveClient,
    handleCancelEdit,
    handleSearchChange,
    handlePageChange,
    handleSelectClient,
    saveClientNotes,
    refreshData
  };
};
