
// We'll create a smaller component for the price display to make the form more maintainable
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { storeTicketData } from '@/lib/dataService';
import { getCustomerByPhone } from '@/lib/customerService';
import { getCurrentUser } from '@/lib/auth';
import { PaymentMethod } from '@/lib/types';
import DryCleaningOptions, { SelectedDryCleaningItem, dryCleaningItems } from './DryCleaningOptions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const generateTicketNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${year}${month}${day}-${random}`;
};

// Price Display Component to reduce complexity
const PriceDisplay = ({ totalPrice }: { totalPrice: number }) => (
  <div>
    <Label>Precio Total</Label>
    <div className="text-2xl font-bold mt-1">${totalPrice.toLocaleString()}</div>
  </div>
);

// Payment Method Selector Component
const PaymentMethodSelector = ({ 
  value, 
  onChange 
}: { 
  value: PaymentMethod; 
  onChange: (value: PaymentMethod) => void 
}) => (
  <div>
    <Label htmlFor="paymentMethod">Método de Pago</Label>
    <Select 
      value={value} 
      onValueChange={onChange}
    >
      <SelectTrigger id="paymentMethod" className="mt-1">
        <SelectValue placeholder="Método de pago" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cash">Efectivo</SelectItem>
        <SelectItem value="debit">Tarjeta de Débito</SelectItem>
        <SelectItem value="mercadopago">Mercado Pago</SelectItem>
        <SelectItem value="cuenta_dni">Cuenta DNI</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const SimpleTicketForm = () => {
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
  
  // Admin-specific date selection
  const [date, setDate] = useState<Date>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('valet');
  
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
      calculatedPrice = basePrice * valetQuantity;
    } else if (activeTab === 'tintoreria') {
      // Calculate dry cleaning total
      calculatedPrice = selectedDryCleaningItems.reduce((total, item) => {
        const itemDetails = dryCleaningItems.find(dci => dci.id === item.id);
        return total + ((itemDetails?.price || 0) * item.quantity);
      }, 0);
    }
    
    setTotalPrice(calculatedPrice);
  }, [valetQuantity, selectedDryCleaningItems, activeTab]);
  
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
        toast.success(`Cliente encontrado: ${customer.name}`);
      } else {
        toast.error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
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
    
    if (activeTab === 'valet' && valetQuantity <= 0) {
      toast.error('La cantidad de valets debe ser mayor a cero');
      return;
    }
    
    if (activeTab === 'tintoreria' && selectedDryCleaningItems.length === 0) {
      toast.error('Por favor seleccione al menos un artículo de tintorería');
      return;
    }
    
    const ticketNumber = generateTicketNumber();
    
    // Collect laundry options
    const laundryOptions = [];
    if (separateByColor) laundryOptions.push('separateByColor');
    if (delicateDry) laundryOptions.push('delicateDry');
    if (stainRemoval) laundryOptions.push('stainRemoval');
    if (bleach) laundryOptions.push('bleach');
    if (noFragrance) laundryOptions.push('noFragrance');
    if (noDry) laundryOptions.push('noDry');
    
    try {
      // Prepare ticket data
      const ticketData = {
        ticketNumber,
        totalPrice,
        paymentMethod,
        valetQuantity: activeTab === 'valet' ? valetQuantity : 0, // Use 0 for dry cleaning only tickets
        customDate: isAdmin ? date : undefined, // Use custom date only for admins
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
      
      // Store the ticket
      const success = await storeTicketData(
        ticketData,
        customerData,
        dryCleaningItemsData,
        laundryOptions
      );
      
      if (success) {
        toast.success('Ticket generado correctamente');
        
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
        if (isAdmin) setDate(new Date());
        setActiveTab('valet');
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
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="customerName">Nombre del Cliente</Label>
                    <Input 
                      id="customerName" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="Nombre completo"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="phoneNumber">Teléfono</Label>
                    <Input 
                      id="phoneNumber" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                      placeholder="Número de contacto"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="lookupPhone">Buscar Cliente</Label>
                    <Input 
                      id="lookupPhone" 
                      value={lookupPhone} 
                      onChange={(e) => setLookupPhone(e.target.value)} 
                      placeholder="Buscar por teléfono"
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleCustomerLookup}
                    variant="outline"
                  >
                    Buscar
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {/* Date Selection (Admin only) */}
                {isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Seleccionar fecha</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => date && setDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                {/* Service Type Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="valet">Valet</TabsTrigger>
                    <TabsTrigger value="tintoreria">Tintorería</TabsTrigger>
                  </TabsList>
                  
                  {/* Valet Tab Content */}
                  <TabsContent value="valet" className="mt-4">
                    <div className="flex flex-col gap-4 sm:flex-row items-end">
                      <div className="w-full sm:w-1/3">
                        <Label htmlFor="valetQuantity">Cantidad de Valets</Label>
                        <Input 
                          id="valetQuantity" 
                          type="number" 
                          min="1"
                          value={valetQuantity}
                          onChange={(e) => setValetQuantity(parseInt(e.target.value) || 1)}
                          className="mt-1"
                        />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <PaymentMethodSelector 
                          value={paymentMethod} 
                          onChange={handlePaymentMethodChange} 
                        />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <PriceDisplay totalPrice={totalPrice} />
                      </div>
                    </div>
                    
                    {/* Laundry Options */}
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Opciones de Lavado</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="separateByColor" 
                            checked={separateByColor} 
                            onCheckedChange={setSeparateByColor}
                          />
                          <Label htmlFor="separateByColor">Separar por Color</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="delicateDry" 
                            checked={delicateDry} 
                            onCheckedChange={setDelicateDry}
                          />
                          <Label htmlFor="delicateDry">Secado Delicado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="stainRemoval" 
                            checked={stainRemoval} 
                            onCheckedChange={setStainRemoval}
                          />
                          <Label htmlFor="stainRemoval">Quitamanchas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="bleach" 
                            checked={bleach} 
                            onCheckedChange={setBleach}
                          />
                          <Label htmlFor="bleach">Blanquear</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="noFragrance" 
                            checked={noFragrance} 
                            onCheckedChange={setNoFragrance}
                          />
                          <Label htmlFor="noFragrance">Sin Perfume</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="noDry" 
                            checked={noDry} 
                            onCheckedChange={setNoDry}
                          />
                          <Label htmlFor="noDry">Sin Secar</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Dry Cleaning Tab Content */}
                  <TabsContent value="tintoreria" className="mt-4">
                    <div className="flex flex-col gap-4 sm:flex-row items-end mb-6">
                      <div className="w-full sm:w-1/2">
                        <PaymentMethodSelector 
                          value={paymentMethod} 
                          onChange={handlePaymentMethodChange} 
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <PriceDisplay totalPrice={totalPrice} />
                      </div>
                    </div>
                    
                    <DryCleaningOptions 
                      selectedItems={selectedDryCleaningItems}
                      onItemsChange={setSelectedDryCleaningItems}
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Uso del Formulario:</h3>
              <ul className="ml-5 mt-2 list-disc text-muted-foreground text-sm space-y-1">
                <li>Complete los datos del cliente.</li>
                <li>Puede buscar clientes existentes por teléfono.</li>
                <li>Seleccione el tipo de servicio (valet o tintorería).</li>
                <li>Para valet, especifique la cantidad y opciones.</li>
                <li>Para tintorería, seleccione los artículos.</li>
                <li>Seleccione el método de pago.</li>
                <li>El precio se calcula automáticamente.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Recordatorios:</h3>
              <ul className="ml-5 mt-2 list-disc text-muted-foreground text-sm space-y-1">
                <li>El valet tiene un costo de $5.000 cada uno.</li>
                <li>Los precios de tintorería varían según el artículo.</li>
                <li>Verificar siempre la información antes de generar el ticket.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleTicketForm;
