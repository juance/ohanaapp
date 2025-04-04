
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
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { storeTicketData } from '@/lib/dataService';
import { getCustomerByPhone } from '@/lib/customerService';
import { getCurrentUser } from '@/lib/auth';
import { PaymentMethod } from '@/lib/types';

const generateTicketNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${year}${month}${day}-${random}`;
};

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
  
  // Customer lookup
  const [lookupPhone, setLookupPhone] = useState('');
  
  // Admin-specific date selection
  const [date, setDate] = useState<Date>(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const user = await getCurrentUser();
      setIsAdmin(user?.role === 'admin');
    };
    checkAdmin();
  }, []);
  
  // Calculate price when quantity changes
  useEffect(() => {
    const basePrice = 15; // Base price per valet
    const calculatedPrice = basePrice * valetQuantity;
    
    // Add extra costs for special options
    let extraCost = 0;
    if (stainRemoval) extraCost += 5 * valetQuantity;
    if (delicateDry) extraCost += 2 * valetQuantity;
    
    setTotalPrice(calculatedPrice + extraCost);
  }, [valetQuantity, stainRemoval, delicateDry]);
  
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
    
    if (valetQuantity <= 0) {
      toast.error('La cantidad de valets debe ser mayor a cero');
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
      // Prepare ticket data with correct PaymentMethod type
      const ticketData = {
        ticketNumber,
        totalPrice,
        paymentMethod,
        valetQuantity,
        customDate: isAdmin ? date : undefined, // Use custom date only for admins
      };
      
      // Prepare customer data
      const customerData = {
        name: customerName,
        phoneNumber,
      };
      
      // Store the ticket
      const success = await storeTicketData(
        ticketData,
        customerData,
        [], // No dry cleaning items in simple form
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
        if (isAdmin) setDate(new Date());
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
            <CardTitle className="text-xl">Ingreso de Valet</CardTitle>
            <CardDescription>Generar ticket para valets</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="paymentMethod">Método de Pago</Label>
                    <Select 
                      value={paymentMethod} 
                      onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
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
                  <div className="w-full sm:w-1/3">
                    <Label>Precio Total</Label>
                    <div className="text-2xl font-bold mt-1">${totalPrice.toFixed(2)}</div>
                  </div>
                </div>
                
                {isAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
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
                
                <div>
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
                      <Label htmlFor="delicateDry">Secado Delicado (+$2)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="stainRemoval" 
                        checked={stainRemoval} 
                        onCheckedChange={setStainRemoval}
                      />
                      <Label htmlFor="stainRemoval">Quitamanchas (+$5)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="bleach" 
                        checked={bleach} 
                        onCheckedChange={setBleach}
                      />
                      <Label htmlFor="bleach">Usar Lavandina</Label>
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
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Generar Ticket
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
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
                <li>Especifique la cantidad de valets.</li>
                <li>Seleccione el método de pago.</li>
                <li>Marque las opciones de lavado requeridas.</li>
                <li>El precio se calcula automáticamente.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium">Recordatorios:</h3>
              <ul className="ml-5 mt-2 list-disc text-muted-foreground text-sm space-y-1">
                <li>El secado delicado tiene un costo adicional.</li>
                <li>El servicio de quitamanchas tiene un costo adicional.</li>
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
