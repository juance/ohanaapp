
import { toast } from 'sonner';
import { storeTicketData } from '@/lib/dataService';
import { LaundryOption, Ticket } from '@/lib/types';
import { dryCleaningItems } from '@/components/DryCleaningOptions';

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
      resetTicketFormState
    } = formState;
    
    if (!customerName || !phoneNumber) {
      toast.error('Por favor complete los datos del cliente');
      return;
    }
    
    if (phoneNumber.length < 8) {
      toast.error('Por favor ingrese un número de teléfono válido');
      return;
    }
    
    if (activeTab === 'valet' && valetQuantity <= 0 && !useFreeValet) {
      toast.error('La cantidad de valets debe ser mayor a cero');
      return;
    }
    
    if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
      toast.error('Por favor seleccione al menos un artículo de tintorería');
      return;
    }
    
    // Ajustamos la cantidad de valets si se usa uno gratis
    const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;
    
    try {
      // Prepare ticket data
      const ticketData = {
        totalPrice,
        paymentMethod: paymentMethod as any,
        valetQuantity: activeTab === 'valet' ? effectiveValetQuantity : 0, // Use 0 for dry cleaning only tickets
        customDate: date, // Now all users can set a custom date
        usesFreeValet: useFreeValet // Indicamos si se está usando un valet gratis
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
          toast.success('Ticket de valet gratis generado correctamente');
        } else {
          toast.success('Ticket generado correctamente');
        }
        
        // Create a ticket object for printing
        if (onTicketGenerated) {
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
            ticketNumber: '',
            basketTicketNumber: undefined, // This will be assigned by the server
            clientName: customerName,
            phoneNumber,
            services,
            paymentMethod: paymentMethod as any,
            totalPrice,
            status: 'ready',
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
          };
          
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
    }
  };

  return { handleSubmit };
};
