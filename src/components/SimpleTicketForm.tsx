
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Phone, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PaymentMethod, LaundryOption } from '@/lib/types';
import { storeTicketData } from '@/lib/dataService';

const SimpleTicketForm = () => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valetQuantity, setValetQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<LaundryOption[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [pricePerValet] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalPrice = pricePerValet * valetQuantity;
  
  const laundryOptions = [
    { id: 'separateByColor', label: '1. Separar por color' },
    { id: 'delicateDry', label: '2. Secar en delicado' },
    { id: 'stainRemoval', label: '3. Desmanchar' },
    { id: 'bleach', label: '4. Blanquear' },
    { id: 'noFragrance', label: '5. Sin perfume' },
    { id: 'noDry', label: '6. No secar' },
  ];
  
  const handleOptionToggle = (optionId: LaundryOption) => {
    setSelectedOptions(selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId]
    );
  };
  
  const incrementValet = () => {
    setValetQuantity(prev => prev + 1);
  };
  
  const decrementValet = () => {
    if (valetQuantity > 1) {
      setValetQuantity(prev => prev - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      toast.error('Por favor ingrese el nombre del cliente');
      return;
    }
    
    if (!phoneNumber.trim()) {
      toast.error('Por favor ingrese el número de teléfono');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate ticket number
      const ticketNumber = String(Math.floor(Math.random() * 10000000)).padStart(8, '0');
      
      // Store ticket data
      const success = await storeTicketData(
        {
          ticketNumber,
          totalPrice,
          paymentMethod,
          valetQuantity
        },
        {
          name: clientName,
          phoneNumber
        },
        [], // No dry cleaning items in this simplified version
        selectedOptions
      );
      
      if (success) {
        toast.success('Ticket generado exitosamente', {
          description: `Ticket #${ticketNumber} para ${clientName}`,
        });
        
        // Reset form
        setClientName('');
        setPhoneNumber('');
        setValetQuantity(1);
        setSelectedOptions([]);
        setPaymentMethod('cash');
      } else {
        toast.error('Error al generar el ticket', {
          description: 'Intente nuevamente',
        });
      }
    } catch (error) {
      console.error('Error generando ticket:', error);
      toast.error('Error al generar el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2" htmlFor="clientName">
            <User className="h-4 w-4" />
            Nombre del Cliente
          </Label>
          <Input
            id="clientName"
            placeholder="Ingrese nombre del cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2" htmlFor="phoneNumber">
            <Phone className="h-4 w-4" />
            Número de Teléfono
          </Label>
          <Input
            id="phoneNumber"
            placeholder="Ingrese número telefónico"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2" htmlFor="valetQuantity">
            <Package className="h-4 w-4" />
            Cantidad de Valet
          </Label>
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 w-10 rounded-full p-0"
              onClick={decrementValet}
            >
              −
            </Button>
            <Input
              id="valetQuantity"
              type="number"
              className="w-16 text-center"
              value={valetQuantity}
              onChange={(e) => setValetQuantity(parseInt(e.target.value) || 1)}
              min={1}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="h-10 w-10 rounded-full p-0"
              onClick={incrementValet}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-lg font-medium">Servicios de Tintorería</h3>
          <div className="border-t pt-4">
            <h4 className="mb-3 font-medium">Opciones de lavado:</h4>
            <div className="grid grid-cols-2 gap-3">
              {laundryOptions.map((option) => (
                <div className="flex items-start space-x-2" key={option.id}>
                  <Checkbox 
                    id={option.id} 
                    checked={selectedOptions.includes(option.id as LaundryOption)}
                    onCheckedChange={() => handleOptionToggle(option.id as LaundryOption)}
                  />
                  <Label htmlFor={option.id} className="text-sm font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Método de pago:</h3>
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash">Efectivo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="debit" id="debit" />
            <Label htmlFor="debit">Débito</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mercadopago" id="mercadopago" />
            <Label htmlFor="mercadopago">Mercado Pago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cuenta_dni" id="cuenta_dni" />
            <Label htmlFor="cuenta_dni">Cuenta DNI</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between">
          <span className="font-medium">Precio por Valet:</span>
          <span>$ {pricePerValet.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-blue-600">$ {totalPrice.toLocaleString()}</span>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Procesando...' : 'Generar Ticket →'}
      </Button>
    </form>
  );
};

export default SimpleTicketForm;
