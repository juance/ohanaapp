
import { useState, useCallback } from 'react';

/**
 * Hook for managing dialogs related to pickup orders
 */
export const usePickupDialogs = () => {
  // State for cancel dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // State for payment method dialog
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);

  /**
   * Opens the cancel dialog
   */
  const handleOpenCancelDialog = useCallback((): void => {
    setCancelDialogOpen(true);
  }, []);

  /**
   * Opens the payment method dialog
   */
  const handleOpenPaymentMethodDialog = useCallback((): void => {
    setPaymentMethodDialogOpen(true);
  }, []);

  return {
    // Dialog states
    cancelDialogOpen,
    cancelReason,
    paymentMethodDialogOpen,
    
    // Dialog setters
    setCancelDialogOpen,
    setCancelReason,
    setPaymentMethodDialogOpen,
    
    // Dialog openers
    handleOpenCancelDialog,
    handleOpenPaymentMethodDialog
  };
};
