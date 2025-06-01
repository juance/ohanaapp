
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { LaundryOption, Ticket } from '@/lib/types';
import { storeTicket } from '@/lib/data/ticket/ticketStorageService';
import { updateDashboardMetrics } from '@/lib/services/metricsService';
import { createTicketForPreview } from '@/lib/services/ticketPreviewService';
import { validateTicketInput } from '@/lib/services/ticketValidationService';
import { useQueryClient } from '@tanstack/react-query';
import { TicketFormState } from '@/lib/types/ticket.types';

export const useTicketFormSubmit = (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const {
        customerName,
        phoneNumber,
        valetQuantity,
        useFreeValet,
        paymentMethod,
        totalPrice,
        activeTab,
        date,
        selectedDryCleaningItems,
        getSelectedLaundryOptions,
        resetCustomerForm,
        resetValetForm,
        resetDryCleaningForm,
        resetTicketFormState,
        isPaidInAdvance
      } = formState;

      // Validate form input
      if (!validateTicketInput(
        customerName,
        phoneNumber,
        activeTab,
        valetQuantity,
        useFreeValet,
        selectedDryCleaningItems
      )) {
        setIsSubmitting(false);
        return;
      }

      // Adjust the valet quantity if using a free one
      const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;

      // Prepare dry cleaning items for tintorería
      let dryCleaningItemsForTicket: any[] = [];
      if (activeTab === 'tintoreria' && selectedDryCleaningItems?.length > 0) {
        dryCleaningItemsForTicket = selectedDryCleaningItems.map(item => {
          const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
          return {
            name: itemDetails?.name || item.name || 'Servicio de tintorería',
            quantity: item.quantity || 1,
            price: (itemDetails?.price || 0) * (item.quantity || 1)
          };
        });
        console.log('Prepared dry cleaning items for ticket:', dryCleaningItemsForTicket);
      }

      // Store the ticket using storeTicket function
      const success = await storeTicket(
        {
          totalPrice: useFreeValet ? 0 : totalPrice,
          paymentMethod: paymentMethod as any,
          valetQuantity: activeTab === 'valet' ? effectiveValetQuantity : 0,
          status: 'pending',
          isPaid: isPaidInAdvance || false,
          customDate: date,
          isPaidInAdvance: isPaidInAdvance || false
        },
        {
          name: customerName,
          phoneNumber: phoneNumber
        },
        dryCleaningItemsForTicket,
        getSelectedLaundryOptions()
      );

      if (success) {
        // After successfully creating a ticket, update dashboard metrics
        try {
          await updateDashboardMetrics({
            ticketType: activeTab,
            isPaid: isPaidInAdvance || false,
            total: useFreeValet ? 0 : totalPrice,
            items: dryCleaningItemsForTicket,
            valetQuantity: effectiveValetQuantity,
            usesFreeValet: useFreeValet
          });
        } catch (metricsError) {
          console.error("Error updating dashboard metrics:", metricsError);
          // This error shouldn't block the ticket creation process
        }

        // Invalidate the pickupTickets query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['pickupTickets'] });

        // Show success message
        if (useFreeValet) {
          toast.success('Ticket de valet gratis generado correctamente');
        } else if (isPaidInAdvance) {
          toast.success('Ticket generado correctamente (Pagado por adelantado)');
        } else {
          toast.success('Ticket generado correctamente');
        }

        // Create a ticket object for printing
        if (onTicketGenerated) {
          const ticketForPrint = await createTicketForPreview(
            customerName,
            phoneNumber,
            activeTab,
            totalPrice,
            paymentMethod,
            effectiveValetQuantity,
            dryCleaningItemsForTicket,
            date,
            useFreeValet,
            isPaidInAdvance || false
          );

          onTicketGenerated(ticketForPrint, getSelectedLaundryOptions());
        }

        // Reset form
        resetCustomerForm();
        resetValetForm();
        resetDryCleaningForm();
        resetTicketFormState();
      } else {
        toast.error('Error al generar el ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Error al generar el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};

// Mock data array for dry cleaning items
const dryCleaningItems = [
  { id: 'shirt', name: 'Camisa', price: 20 },
  { id: 'pants', name: 'Pantalón', price: 25 },
  { id: 'suit', name: 'Traje', price: 45 },
  { id: 'dress', name: 'Vestido', price: 35 },
  { id: 'coat', name: 'Abrigo', price: 40 },
  { id: 'blanket', name: 'Manta', price: 40 },
];
