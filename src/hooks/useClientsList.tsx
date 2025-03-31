
import { useState } from 'react';
import { useClientData } from './useClientData';
import { useClientSearch } from './clients/useClientSearch';
import { useClientForm } from './clients/useClientForm';
import { useClientNotes } from './clients/useClientNotes';
import { useClientExport } from './clients/useClientExport';
import { useClientSelection } from './clients/useClientSelection';
import { ClientVisit } from '@/lib/types';

export const useClientsList = () => {
  const { frequentClients, refreshData, loading, error } = useClientData();
  
  // Use smaller, focused hooks
  const {
    clientNotes,
    isLoadingNotes,
    loadClientNotes,
    saveClientNotes
  } = useClientNotes();
  
  const {
    selectedClient,
    handleSelectClient
  } = useClientSelection(loadClientNotes);
  
  const {
    searchQuery,
    currentPage,
    totalPages,
    filteredClients,
    currentClients,
    handleSearchChange,
    handlePageChange
  } = useClientSearch(frequentClients);
  
  const {
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
    handleSaveClient: saveClient,
    handleCancelEdit
  } = useClientForm(refreshData);
  
  const {
    isExporting,
    handleExportClients
  } = useClientExport();
  
  // Wrapper to pass selectedClient to saveClient
  const handleSaveClient = (id: string) => {
    return saveClient(id, selectedClient);
  };
  
  // Wrapper to pass selectedClient to saveClientNotes
  const handleSaveClientNotes = (notes: string) => {
    return saveClientNotes(notes, selectedClient);
  };
  
  // Wrapper to pass filteredClients to handleExportClients
  const handleExportClientData = () => {
    return handleExportClients(filteredClients);
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
    saveClientNotes: handleSaveClientNotes,
    handleExportClients: handleExportClientData,
    refreshData
  };
};
