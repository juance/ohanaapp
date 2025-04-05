
import { toast } from '@/hooks/use-toast';
import { storeTicketData } from '@/lib/dataService';
import { LaundryOption, Ticket } from '@/lib/types';
import { dryCleaningItems } from '@/components/DryCleaningOptions';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';

// Types for the combined form state
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
  isPaidInAdvance?: boolean; // Add the new optional field
}

export const useTicketFormSubmit = (
  formState: TicketFormState,
  onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void
) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    if (!customerName || !phoneNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor complete los datos del cliente'
      });
      return;
    }
    
    if (phoneNumber.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor ingrese un número de teléfono válido'
      });
      return;
    }
    
    if (activeTab === 'valet' && valetQuantity <= 0 && !useFreeValet) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'La cantidad de valets debe ser mayor a cero'
      });
      return;
    }
    
    if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor seleccione al menos un artículo de tintorería'
      });
      return;
    }
    
    // Ajustamos la cantidad de valets si se usa uno gratis
    const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;
    
    try {
      // Prepare ticket data
      const ticketData = {
        totalPrice: useFreeValet ? 0 : totalPrice, // If it's free, set price to 0
        paymentMethod: paymentMethod as any,
        valetQuantity: activeTab === 'valet' ? effectiveValetQuantity : 0, // Use 0 for dry cleaning only tickets
        customDate: date, // Now all users can set a custom date
        usesFreeValet: useFreeValet, // Indicamos si se está usando un valet gratis
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
      const success = await storeTicketData(
        ticketData,
        customerData,
        dryCleaningItemsData,
        laundryOptions
      );
      
      if (success) {
        if (useFreeValet) {
          toast({
            title: "Success",
            description: 'Ticket de valet gratis generado correctamente'
          });
        } else if (isPaidInAdvance) {
          toast({
            title: "Success",
            description: 'Ticket generado correctamente (Pagado por adelantado)'
          });
        } else {
          toast({
            title: "Success",
            description: 'Ticket generado correctamente'
          });
        }
        
        // Create a ticket object for printing
        if (onTicketGenerated) {
          // Get a ticket number for the preview
          let ticketNumber = '1';
          try {
            ticketNumber = await getNextTicketNumber();
          } catch (error) {
            console.error('Error getting ticket number for preview:', error);
          }
          
          const services = activeTab === 'valet' 
            ? [{ id: crypto.randomUUID(), name: 'Valet', price: totalPrice, quantity: effectiveValetQuantity }] 
            : dryCleaningItemsData.map(item => ({
                id: crypto.randomUUID(),
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }));
              
          const ticketForPrint: Ticket = {
            id: crypto.randomUUID(),
            ticketNumber: ticketNumber, // Use the next ticket number
            basketTicketNumber: undefined, // This will be assigned by the server
            clientName: customerName,
            phoneNumber,
            services,
            paymentMethod: paymentMethod as any,
            totalPrice: useFreeValet ? 0 : totalPrice, // If it's a free valet, set price to 0
            status: 'ready',
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
            isPaid: isPaidInAdvance // Add the paid status
          };
          
          onTicketGenerated(ticketForPrint, laundryOptions);
        }
        
        // Reset form
        resetCustomerForm();
        resetValetForm();
        resetDryCleaningForm();
        resetTicketFormState();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'Error al generar el ticket'
        });
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Error al generar el ticket'
      });
    }
  };

  return { handleSubmit };
};
