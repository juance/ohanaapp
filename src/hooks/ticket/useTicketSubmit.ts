
import { useState } from 'react';
import { toast } from '@/lib/toast';
import { LaundryOption, Ticket } from '@/lib/types';
import { storeTicket } from '@/lib/dataService';
import { updateDashboardMetrics } from '@/lib/services/metricsService';
import { createTicketForPreview } from '@/lib/services/ticketPreviewService';
import { validateTicketInput } from '@/lib/services/ticketValidationService';

// Types for the form state
interface TicketFormState {
  customerName: string;
  phoneNumber: string;
  valetQuantity: number;
  useFreeValet: boolean;
  paymentMethod: string;
  totalPrice: number;
  activeTab: string;
  date: Date;
  selectedDryCleaningItems: any[];
  getSelectedLaundryOptions: () => LaundryOption[];
  resetCustomerForm: () => void;
  resetValetForm: () => void;
  resetDryCleaningForm: () => void;
  resetTicketFormState: () => void;
  isPaidInAdvance?: boolean;
}

export const useTicketSubmit = (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      // Prepare ticket data
      const ticketData = {
        totalPrice: useFreeValet ? 0 : totalPrice, // If it's free, set price to 0
        paymentMethod: paymentMethod as any,
        valetQuantity: activeTab === 'valet' ? effectiveValetQuantity : 0, // Use 0 for dry cleaning only tickets
        customDate: date, // Now all users can set a custom date
        usesFreeValet: useFreeValet, // Indicate if a free valet is being used
        isPaidInAdvance: isPaidInAdvance // Add the paid in advance flag
      };
      
      // Prepare customer data
      const customerData = {
        name: customerName,
        phoneNumber,
      };
      
      // Prepare dry cleaning items
      const dryCleaningItemsData = activeTab === 'tintoreria' 
        ? selectedDryCleaningItems.map(item => {
            const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
            return {
              name: itemDetails?.name || '',
              quantity: item.quantity,
              price: (itemDetails?.price || 0) * item.quantity
            };
          })
        : [];
      
      // Collect laundry options
      const laundryOptions = getSelectedLaundryOptions();
      
      // Store the ticket
      const success = await storeTicket(
        ticketData,
        customerData,
        dryCleaningItemsData,
        laundryOptions
      );

      if (success) {
        // After successfully creating a ticket, update dashboard metrics
        try {
          await updateDashboardMetrics({
            ticketType: activeTab,
            isPaid: isPaidInAdvance || false,
            total: useFreeValet ? 0 : totalPrice,
            items: dryCleaningItemsData,
            valetQuantity: effectiveValetQuantity,
            usesFreeValet: useFreeValet
          });
        } catch (metricsError) {
          console.error("Error updating dashboard metrics:", metricsError);
          // This error shouldn't block the ticket creation process
        }

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
            dryCleaningItemsData,
            date,
            useFreeValet,
            isPaidInAdvance || false
          );
          
          onTicketGenerated(ticketForPrint, laundryOptions);
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
  { id: 'shirt', name: 'Shirt', price: 20 },
  { id: 'pants', name: 'Pants', price: 25 },
  { id: 'suit', name: 'Suit', price: 45 },
  { id: 'dress', name: 'Dress', price: 35 },
  { id: 'coat', name: 'Coat', price: 50 },
  { id: 'blanket', name: 'Blanket', price: 40 },
];
