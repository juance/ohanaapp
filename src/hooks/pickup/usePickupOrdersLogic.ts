
import { useState, useRef, useEffect } from 'react';
import { usePickupTicketQueries } from './usePickupTicketQueries';
import { usePicketTicketServices } from './usePickupTicketServices';
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
  const { ticketServices, isLoadingServices, loadTicketServices } = usePicketTicketServices();
  const { searchQuery, searchFilter, setSearchQuery, setSearchFilter, filterTickets } = usePickupTicketFilters();
  const { 
    cancelDialogOpen, cancelReason, paymentMethodDialogOpen,
    setCancelDialogOpen, setCancelReason, setPaymentMethodDialogOpen,
    handleOpenCancelDialog, handleOpenPaymentMethodDialog 
  } = usePickupDialogs();
  const { formatDate } = usePickupUtils();
  const { 
    handleMarkAsDelivered, handleCancelTicket, handleUpdatePaymentMethod, 
    handlePrintTicket, handleNotifyClient, handleShareWhatsApp, handleUpdateTicketPrice
  } = usePickupTicketOperations();

  // Apply filters to tickets
  const filteredTickets = filterTickets(pickupTickets);

  // Transform ticketServices to the expected format with correct filtering and real data
  const transformedTicketServices = {
    dryCleaningItems: ticketServices
      .filter(service => service.service_type === 'dry_cleaning')
      .map(service => {
        console.log('Transforming dry cleaning service:', service);
        return {
          id: service.id,
          name: service.name, // This should now contain the real name from database
          quantity: service.quantity, // This should now contain the real quantity
          price: service.price // This should now contain the real price
        };
      }),
    laundryOptions: ticketServices
      .filter(service => service.service_type === 'laundry_option')
      .map(service => ({
        id: service.id,
        option_type: service.name
      }))
  };

  console.log('Transformed ticket services:', transformedTicketServices);

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

  const handleUpdateTicketPriceWrapper = async (ticketId: string, newPrice: number): Promise<void> => {
    await handleUpdateTicketPrice(ticketId, newPrice);
    refetch();
  };

  return {
    // Data
    filteredTickets,
    ticketServices: transformedTicketServices,

    // States
    selectedTicket,
    searchQuery,
    searchFilter,
    cancelDialogOpen,
    cancelReason,
    paymentMethodDialogOpen,
    isLoadingServices,

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
    handleShareWhatsApp: (ticketId: string, phoneNumber?: string) => 
      handleShareWhatsApp(ticketId, phoneNumber, pickupTickets),
    handleOpenPaymentMethodDialog,
    handleUpdatePaymentMethod: handleUpdatePaymentMethodWrapper,
    handleUpdateTicketPrice: handleUpdateTicketPriceWrapper,
    handleError,
    formatDate
  };
};
