
import { useState } from 'react';
import { toast } from 'sonner';
import { storeTicketData } from '@/lib/dataService';
import { LaundryOption, PaymentMethod, Ticket, Customer } from '@/lib/types';
import { SelectedDryCleaningItem } from '@/components/DryCleaningOptions';
import { dryCleaningItems } from '@/components/DryCleaningOptions';

export const useTicketForm = (onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void) => {
  // Customer information
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Valet information
  const [valetQuantity, setValetQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Laundry options
  const [separateByColor, setSeparateByColor] = useState(false);
  const [delicateDry, setDelicateDry] = useState(false);
  const [stainRemoval, setStainRemoval] = useState(false);
  const [bleach, setBleach] = useState(false);
  const [noFragrance, setNoFragrance] = useState(false);
  const [noDry, setNoDry] = useState(false);
  
  // Dry cleaning items
  const [selectedDryCleaningItems, setSelectedDryCleaningItems] = useState<SelectedDryCleaningItem[]>([]);
  
  // Customer lookup
  const [lookupPhone, setLookupPhone] = useState('');
  
  // Date selection for all users
  const [date, setDate] = useState<Date>(new Date());
  
  // Active tab
  const [activeTab, setActiveTab] = useState('valet');

  // Estado para valets gratis
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [useFreeValet, setUseFreeValet] = useState(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState(false);

  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        paymentMethod,
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
      const laundryOptions: LaundryOption[] = [];
      if (separateByColor) laundryOptions.push('separateByColor');
      if (delicateDry) laundryOptions.push('delicateDry');
      if (stainRemoval) laundryOptions.push('stainRemoval');
      if (bleach) laundryOptions.push('bleach');
      if (noFragrance) laundryOptions.push('noFragrance');
      if (noDry) laundryOptions.push('noDry');
      
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
            clientName: customerName,
            phoneNumber,
            services,
            paymentMethod,
            totalPrice,
            status: 'ready',
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
          };
          
          onTicketGenerated(ticketForPrint, laundryOptions);
        }
        
        // Reset form
        resetForm();
      } else {
        toast.error('Error al generar el ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Error al generar el ticket');
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setPhoneNumber('');
    setValetQuantity(1);
    setSeparateByColor(false);
    setDelicateDry(false);
    setStainRemoval(false);
    setBleach(false);
    setNoFragrance(false);
    setNoDry(false);
    setLookupPhone('');
    setPaymentMethod('cash');
    setSelectedDryCleaningItems([]);
    setDate(new Date());
    setActiveTab('valet');
    setFoundCustomer(null);
    setUseFreeValet(false);
  };

  return {
    // Form state
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    valetQuantity,
    setValetQuantity,
    totalPrice,
    setTotalPrice,
    paymentMethod,
    handlePaymentMethodChange,
    separateByColor,
    setSeparateByColor,
    delicateDry,
    setDelicateDry,
    stainRemoval,
    setStainRemoval,
    bleach,
    setBleach,
    noFragrance,
    setNoFragrance,
    noDry,
    setNoDry,
    selectedDryCleaningItems,
    setSelectedDryCleaningItems,
    lookupPhone,
    setLookupPhone,
    date,
    setDate,
    activeTab,
    setActiveTab,
    foundCustomer,
    setFoundCustomer,
    useFreeValet,
    setUseFreeValet,
    showFreeValetDialog,
    setShowFreeValetDialog,
    
    // Form submission
    handleSubmit
  };
};
