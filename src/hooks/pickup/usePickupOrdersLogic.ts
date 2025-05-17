
import { useState, useRef, useEffect } from 'react';
import { usePickupTicketQueries } from './usePickupTicketQueries';
import { usePickupTicketServices } from './usePickupTicketServices';
import { usePickupTicketOperations } from './usePickupTicketOperations';
import { usePickupDialogs } from './usePickupDialogs';
import { usePickupTicketFilters } from './usePickupTicketFilters';
import { usePickupUtils } from './usePickupUtils';
import { toast } from '@/lib/toast';

/**
 * Main hook for pickup orders logic
 */
export const usePickupOrdersLogic = () => {
  // State for the selected ticket
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Reference for the ticket detail panel
  const ticketDetailRef = useRef<HTMLDivElement>(null);

  // Get data and functionality from other hooks
  const { pickupTickets, isLoading, isError, error, refetch } = usePickupTicketQueries();
  const { ticketServices, loadTicketServices } = usePickupTicketServices();
  const { searchQuery, searchFilter, setSearchQuery, setSearchFilter, filterTickets } = usePickupTicketFilters();
  const { 
    cancelDialogOpen, cancelReason, paymentMethodDialogOpen,
    setCancelDialogOpen, setCancelReason, setPaymentMethodDialogOpen,
    handleOpenCancelDialog, handleOpenPaymentMethodDialog 
  } = usePickupDialogs();
  const { formatDate } = usePickupUtils();
  const { 
    handleMarkAsDelivered, handleCancelTicket, handleUpdatePaymentMethod, 
    handlePrintTicket, handleNotifyClient 
  } = usePickupTicketOperations();

  // Apply filters to tickets
  const filteredTickets = filterTickets(pickupTickets);

  /**
   * Handles errors in a consistent way
   */
  const handleError = (err: any): void => {
    console.error("Error in usePickupOrdersLogic:", err);
    toast.error(`Error: ${err.message || 'Ha ocurrido un error inesperado'}`);
  };

  // Wrapper functions that use the current context
  const handleCancelTicketWrapper = async (): Promise<void> => {
    if (!selectedTicket) return;
    await handleCancelTicket(selectedTicket, cancelReason);
    setCancelDialogOpen(false);
    setCancelReason('');
    setSelectedTicket(null);
    refetch();
  };

  const handleUpdatePaymentMethodWrapper = async (paymentMethod: string): Promise<void> => {
    if (!selectedTicket) return;
    await handleUpdatePaymentMethod(selectedTicket, paymentMethod);
    setPaymentMethodDialogOpen(false);
    refetch();
  };

  return {
    // Data
    filteredTickets,
    ticketServices,

    // States
    selectedTicket,
    searchQuery,
    searchFilter,
    cancelDialogOpen,
    cancelReason,
    paymentMethodDialogOpen,

    // References
    ticketDetailRef,

    // Query state
    isLoading,
    isError,
    error,

    // Setters
    setSelectedTicket,
    setSearchQuery,
    setSearchFilter,
    setCancelDialogOpen,
    setCancelReason,
    setPaymentMethodDialogOpen,

    // Functions
    refetch,
    loadTicketServices,
    handleMarkAsDelivered: async (ticketId: string) => {
      await handleMarkAsDelivered(ticketId);
      refetch();
    },
    handleOpenCancelDialog,
    handleCancelTicket: handleCancelTicketWrapper,
    handlePrintTicket,
    handleNotifyClient: (ticketId: string, phoneNumber?: string) => 
      handleNotifyClient(ticketId, phoneNumber, pickupTickets),
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod: handleUpdatePaymentMethodWrapper,
    handleError,
    formatDate
  };
};
