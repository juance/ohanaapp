
import { useTicketDeliveryOperations } from './operations/useTicketDeliveryOperations';
import { useTicketCancellationOperations } from './operations/useTicketCancellationOperations';
import { useTicketPaymentOperations } from './operations/useTicketPaymentOperations';
import useTicketPrintOperations from './operations/useTicketPrintOperations';
import { useTicketNotificationOperations } from './operations/useTicketNotificationOperations';

/**
 * Hook for ticket operations like marking as delivered, cancelling, etc.
 */
export const usePickupTicketOperations = () => {
  const { handleMarkAsDelivered } = useTicketDeliveryOperations();
  const { handleCancelTicket } = useTicketCancellationOperations();
  const { handleUpdatePaymentMethod } = useTicketPaymentOperations();
  const { handlePrintTicket } = useTicketPrintOperations();
  const { handleShareWhatsApp, handleNotifyClient } = useTicketNotificationOperations();

  return {
    handleMarkAsDelivered,
    handleCancelTicket,
    handleUpdatePaymentMethod,
    handlePrintTicket,
    handleShareWhatsApp,
    handleNotifyClient
  };
};
