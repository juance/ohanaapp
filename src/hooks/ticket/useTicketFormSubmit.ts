
import { toast } from '@/lib/toast';
import { storeTicketData } from '@/lib/dataService';
import { LaundryOption, Ticket } from '@/lib/types';
import { dryCleaningItems } from '@/components/DryCleaningOptions';
import { getNextTicketNumber } from '@/lib/data/ticket/ticketNumberService';
import { supabase } from '@/integrations/supabase/client';

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
  isPaidInAdvance?: boolean;
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
    
    // Adjust the valet quantity if using a free one
    const effectiveValetQuantity = useFreeValet ? 1 : valetQuantity;
    
    try {
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
      const success = await storeTicketData(
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

        if (useFreeValet) {
          toast.success('Ticket de valet gratis generado correctamente');
        } else if (isPaidInAdvance) {
          toast.success('Ticket generado correctamente (Pagado por adelantado)');
        } else {
          toast.success('Ticket generado correctamente');
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
        toast.error('Error al generar el ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Error al generar el ticket');
    }
  };

  // Helper function to update dashboard metrics
  const updateDashboardMetrics = async (data: {
    ticketType: string;
    isPaid: boolean;
    total: number;
    items: any[];
    valetQuantity: number;
    usesFreeValet: boolean;
  }) => {
    try {
      // Get current date for grouping metrics
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Get existing stats or create new
      const { data: existingStats, error: fetchError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('stats_date', today)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      // Prepare stats data
      let statsData: any = existingStats?.stats_data || {
        daily_total_tickets: 0,
        daily_paid_tickets: 0,
        daily_total_revenue: 0,
        daily_sales_by_hour: {},
        daily_valet_count: 0,
        daily_free_valets: 0,
        daily_dry_cleaning_items: {},
        
        weekly_total_tickets: 0,
        weekly_paid_tickets: 0,
        weekly_total_revenue: 0,
        weekly_valets_count: 0,
        weekly_free_valets: 0,
        weekly_dry_cleaning_items: {},
        
        monthly_total_tickets: 0,
        monthly_paid_tickets: 0,
        monthly_total_revenue: 0,
        monthly_valets_count: 0,
        monthly_free_valets: 0,
        monthly_dry_cleaning_items: {}
      };
      
      // Update ticket counts
      statsData.daily_total_tickets += 1;
      statsData.weekly_total_tickets += 1;
      statsData.monthly_total_tickets += 1;
      
      // Update paid ticket counts if applicable
      if (data.isPaid) {
        statsData.daily_paid_tickets += 1;
        statsData.weekly_paid_tickets += 1;
        statsData.monthly_paid_tickets += 1;
      }
      
      // Update revenue if there's a total
      if (data.total > 0) {
        statsData.daily_total_revenue += data.total;
        statsData.weekly_total_revenue += data.total;
        statsData.monthly_total_revenue += data.total;
        
        // Update sales by hour
        const currentHour = now.getHours().toString();
        statsData.daily_sales_by_hour[currentHour] = (statsData.daily_sales_by_hour[currentHour] || 0) + data.total;
      }
      
      // Update valet counts
      if (data.ticketType === 'valet') {
        statsData.daily_valet_count += data.valetQuantity;
        statsData.weekly_valets_count += data.valetQuantity;
        statsData.monthly_valets_count += data.valetQuantity;
        
        // Update free valets count
        if (data.usesFreeValet) {
          statsData.daily_free_valets = (statsData.daily_free_valets || 0) + 1;
          statsData.weekly_free_valets = (statsData.weekly_free_valets || 0) + 1;
          statsData.monthly_free_valets = (statsData.monthly_free_valets || 0) + 1;
        }
      }
      
      // Update dry cleaning items count
      if (data.ticketType === 'tintoreria' && data.items.length > 0) {
        for (const item of data.items) {
          // Update daily counts
          statsData.daily_dry_cleaning_items[item.name] = (statsData.daily_dry_cleaning_items[item.name] || 0) + item.quantity;
          
          // Update weekly counts
          statsData.weekly_dry_cleaning_items[item.name] = (statsData.weekly_dry_cleaning_items[item.name] || 0) + item.quantity;
          
          // Update monthly counts
          statsData.monthly_dry_cleaning_items[item.name] = (statsData.monthly_dry_cleaning_items[item.name] || 0) + item.quantity;
        }
      }
      
      // Save updated stats
      if (existingStats) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('dashboard_stats')
          .update({
            stats_data: statsData
          })
          .eq('id', existingStats.id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('dashboard_stats')
          .insert({
            stats_date: today,
            stats_data: statsData
          });
        
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error("Error updating dashboard metrics:", error);
      return false;
    }
  };

  return { handleSubmit };
};
