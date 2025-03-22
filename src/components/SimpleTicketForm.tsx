
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { storeTicketData } from '@/lib/dataService';
import { getCurrentUser } from '@/lib/auth';
import { PaymentMethod, Ticket, LaundryOption, Customer } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SelectedDryCleaningItem, dryCleaningItems } from './DryCleaningOptions';

// Import refactored components
import { PriceDisplay } from './ticket/PriceDisplay';
import { PaymentMethodSelector } from './ticket/PaymentMethodSelector';
import { CustomerLookup } from './ticket/CustomerLookup';
import { LaundryOptions } from './ticket/LaundryOptions';
import { ValetTab } from './ticket/ValetTab';
import { DryCleaningTab } from './ticket/DryCleaningTab';
import { CustomerForm } from './ticket/CustomerForm';
import { DateSelector } from './ticket/DateSelector';
import { FreeValetDialog } from './ticket/FreeValetDialog';
import { Instructions } from './ticket/Instructions';

// Import the customer service directly
import { getCustomerByPhone } from '@/lib/dataService';

const SimpleTicketForm = ({ onTicketGenerated }: { onTicketGenerated?: (ticket: Ticket, options: LaundryOption[]) => void }) => {
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
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('valet');

  // Estado para valets gratis
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [useFreeValet, setUseFreeValet] = useState(false);
  const [showFreeValetDialog, setShowFreeValetDialog] = useState(false);
  
  // Explicitly typed callback to resolve TypeScript error
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value);
  };
  
  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const user = await getCurrentUser();
      setIsAdmin(user?.role === 'admin');
    };
    checkAdmin();
  }, []);
  
  // Calculate price when quantity or selected items change
  useEffect(() => {
    // Base price per valet (updated to 5000)
    const basePrice = 5000;
    let calculatedPrice = 0;
    
    if (activeTab === 'valet') {
      // Si se está usando un valet gratis, el precio es 0
      if (useFreeValet) {
        calculatedPrice = 0;
      } else {
        calculatedPrice = basePrice * valetQuantity;
      }
    } else if (activeTab === 'tintoreria') {
      // Calculate dry cleaning total
      calculatedPrice = selectedDryCleaningItems.reduce((total, item) => {
        const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
        return total + ((itemDetails?.price || 0) * item.quantity);
      }, 0);
    }
    
    setTotalPrice(calculatedPrice);
  }, [valetQuantity, selectedDryCleaningItems, activeTab, useFreeValet]);
  
  const handleCustomerLookup = async () => {
    if (!lookupPhone || lookupPhone.length < 8) {
      toast.error('Por favor ingrese un número de teléfono válido');
      return;
    }
    
    try {
      const customer = await getCustomerByPhone(lookupPhone);
      
      if (customer) {
        setCustomerName(customer.name);
        setPhoneNumber(customer.phoneNumber);
        setFoundCustomer(customer);
        
        // Si el cliente tiene valets gratis, mostrar la opción
        if (customer.freeValets > 0 && activeTab === 'valet') {
          setShowFreeValetDialog(true);
        } else {
          setUseFreeValet(false);
          toast.success(`Cliente encontrado: ${customer.name}`);
        }
      } else {
        setFoundCustomer(null);
        setUseFreeValet(false);
        toast.error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
      setFoundCustomer(null);
      setUseFreeValet(false);
      toast.error('Error al buscar cliente');
    }
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
            ? [{ name: 'Valet', price: totalPrice, quantity: effectiveValetQuantity }] 
            : dryCleaningItemsData.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
              }));
              
          const ticketForPrint: Ticket = {
            id: crypto.randomUUID(),
            ticketNumber: String(Date.now()).slice(-8), // Temporary number, will be replaced by actual DB value
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
      } else {
        toast.error('Error al generar el ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Error al generar el ticket');
    }
  };
  
  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Formulario de Ticket</CardTitle>
            <CardDescription>Genere tickets para valets o tintorería</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer information section */}
              <div className="space-y-4">
                <CustomerForm 
                  customerName={customerName}
                  setCustomerName={setCustomerName}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                />
                
                <CustomerLookup 
                  lookupPhone={lookupPhone}
                  setLookupPhone={setLookupPhone}
                  handleCustomerLookup={handleCustomerLookup}
                  foundCustomer={foundCustomer}
                  activeTab={activeTab}
                  useFreeValet={useFreeValet}
                  setShowFreeValetDialog={setShowFreeValetDialog}
                />
                
                <Separator className="my-4" />
                
                <DateSelector date={date} setDate={setDate} />
                
                <Separator className="my-4" />
                
                {/* Service Type Tabs */}
                <Tabs value={activeTab} onValueChange={(val) => {
                  setActiveTab(val);
                  // Resetear el uso de valet gratis al cambiar de pestaña
                  setUseFreeValet(false);
                }}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="valet">Valet</TabsTrigger>
                    <TabsTrigger value="tintoreria">Tintorería</TabsTrigger>
                  </TabsList>
                  
                  {/* Valet Tab Content */}
                  <TabsContent value="valet" className="mt-4">
                    <ValetTab 
                      valetQuantity={valetQuantity}
                      setValetQuantity={setValetQuantity}
                      paymentMethod={paymentMethod}
                      handlePaymentMethodChange={handlePaymentMethodChange}
                      totalPrice={totalPrice}
                      useFreeValet={useFreeValet}
                      separateByColor={separateByColor}
                      setSeparateByColor={setSeparateByColor}
                      delicateDry={delicateDry}
                      setDelicateDry={setDelicateDry}
                      stainRemoval={stainRemoval}
                      setStainRemoval={setStainRemoval}
                      bleach={bleach}
                      setBleach={setBleach}
                      noFragrance={noFragrance}
                      setNoFragrance={setNoFragrance}
                      noDry={noDry}
                      setNoDry={setNoDry}
                    />
                  </TabsContent>
                  
                  {/* Dry Cleaning Tab Content */}
                  <TabsContent value="tintoreria" className="mt-4">
                    <DryCleaningTab 
                      paymentMethod={paymentMethod}
                      handlePaymentMethodChange={handlePaymentMethodChange}
                      totalPrice={totalPrice}
                      selectedDryCleaningItems={selectedDryCleaningItems}
                      setSelectedDryCleaningItems={setSelectedDryCleaningItems}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Generar Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Instructions panel */}
      <div className="md:col-span-4">
        <Instructions />
      </div>

      {/* Dialog de confirmación para usar valet gratis */}
      <FreeValetDialog 
        open={showFreeValetDialog}
        onOpenChange={setShowFreeValetDialog}
        foundCustomer={foundCustomer}
        setUseFreeValet={setUseFreeValet}
        setValetQuantity={setValetQuantity}
      />
    </div>
  );
};

export default SimpleTicketForm;
