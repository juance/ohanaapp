
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Phone, Package, Plus, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PaymentMethod, LaundryOption } from '@/lib/types';
import { storeTicketData, getStoredTickets } from '@/lib/dataService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Define dry cleaning services and prices
const dryCleaningServices = [
  { id: 'lavado_valet', name: 'Lavado (valet)', price: 5000 },
  { id: 'secado', name: 'Secado', price: 4000 },
  { id: 'lavado_mano', name: 'Lavado a mano (por 3 prendas)', price: 5000 },
  { id: 'lavado_zapatillas', name: 'Lavado de zapatillas (por par)', price: 10000 },
  { id: 'lavado_mantas', name: 'Lavado de mantas, cortinas y colchas (doble secado)', price: 8000 },
  { id: 'ambo_comun', name: 'Ambo común / Ambo lino', priceRange: [19000, 22000] },
  { id: 'blusa_buzo', name: 'Blusa / Buzo', priceRange: [8600, 9800] },
  { id: 'traje', name: 'Traje', priceRange: [29000, 34000] },
  { id: 'saco', name: 'Saco', priceRange: [12000, 14000] },
  { id: 'sacon', name: 'Sacón', price: 13000 },
  { id: 'pantalon_vestir', name: 'Pantalón vestir / lino', priceRange: [8000, 9200] },
  { id: 'pantalon_sky', name: 'Pantalón Sky', price: 14000 },
  { id: 'campera_sky', name: 'Campera Sky', price: 18000 },
  { id: 'pollera', name: 'Pollera', priceRange: [9000, 14400] },
  { id: 'pollera_tableada', name: 'Pollera tableada', priceRange: [11000, 16000] },
  { id: 'pullover', name: 'Pullover', priceRange: [9600, 13000] },
  { id: 'saco_lana', name: 'Saco de lana', priceRange: [10600, 15600] },
  { id: 'camisa_remera', name: 'Camisa / Remera', priceRange: [8000, 9200] },
  { id: 'corbata', name: 'Corbata', price: 7000 },
  { id: 'chaleco_chaqueta', name: 'Chaleco / Chaqueta', priceRange: [10000, 13000] },
  { id: 'campera', name: 'Campera', price: 13000 },
  { id: 'camperon', name: 'Camperón', price: 14600 },
  { id: 'campera_desmontable', name: 'Campera desmontable', priceRange: [15600, 18000] },
  { id: 'campera_inflable', name: 'Campera inflable / plumas', price: 14600 },
  { id: 'tapado_sobretodo', name: 'Tapado / Sobretodo', priceRange: [14600, 16400] },
  { id: 'camperon_inflable', name: 'Camperón inflable o plumas / Tapado', priceRange: [16400, 18000] },
  { id: 'piloto_simple', name: 'Piloto simple', priceRange: [14000, 19000] },
  { id: 'piloto_desmontable', name: 'Piloto desmontable', price: 18000 },
  { id: 'vestido_comun', name: 'Vestido común', priceRange: [14000, 19000] },
  { id: 'vestido_fiesta', name: 'Vestido de fiesta (desde)', price: 22000 },
  { id: 'vestido_15', name: 'Vestido de 15 años (desde)', price: 34000 },
  { id: 'vestido_novia', name: 'Vestido de novia (desde)', price: 40000 },
  { id: 'frazada', name: 'Frazada', priceRange: [14000, 18000] },
  { id: 'acolchado', name: 'Acolchado', priceRange: [16000, 20000] },
  { id: 'acolchado_plumas', name: 'Acolchado de plumas', priceRange: [16000, 22000] },
  { id: 'funda_colchon', name: 'Funda de colchón', priceRange: [19000, 28000] },
  { id: 'cortina_liviana', name: 'Cortina liviana (por m²)', price: 7600 },
  { id: 'cortina_pesada', name: 'Cortina pesada (por m²)', price: 8400 },
  { id: 'cortina_forrada', name: 'Cortina forrada (por m²)', price: 9200 },
  { id: 'alfombra', name: 'Alfombra (por m²)', price: 18000 },
  { id: 'funda_acolchado', name: 'Funda de acolchado', priceRange: [14000, 19000] },
  { id: 'almohada', name: 'Almohada / Almohada plumas', priceRange: [12000, 16000] },
];

const SimpleTicketForm = () => {
  const [clientName, setClientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [valetQuantity, setValetQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<LaundryOption[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [pricePerValet] = useState(5000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextTicketNumber, setNextTicketNumber] = useState('00000001');
  
  // New state for dry cleaning services
  const [selectedService, setSelectedService] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState<{id: string, name: string, price: number, quantity: number}[]>([]);
  const [itemQuantity, setItemQuantity] = useState(1);
  
  // Get the next ticket number
  useEffect(() => {
    const fetchLastTicketNumber = async () => {
      try {
        const tickets = await getStoredTickets();
        if (tickets && tickets.length > 0) {
          // Sort tickets by ticket number
          tickets.sort((a, b) => a.ticketNumber.localeCompare(b.ticketNumber));
          
          // Get the last ticket number
          const lastTicketNumber = tickets[tickets.length - 1].ticketNumber;
          
          // Increment the ticket number
          const nextNumber = (parseInt(lastTicketNumber) + 1).toString().padStart(8, '0');
          setNextTicketNumber(nextNumber);
        }
      } catch (error) {
        console.error('Error fetching last ticket number:', error);
      }
    };
    
    fetchLastTicketNumber();
  }, []);
  
  // Calculate total price including valet and selected services
  const calculateTotalPrice = () => {
    const valetTotal = pricePerValet * valetQuantity;
    const servicesTotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return valetTotal + servicesTotal;
  };
  
  const totalPrice = calculateTotalPrice();
  
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
    if (valetQuantity > 0) {
      setValetQuantity(prev => prev - 1);
    }
  };
  
  const handleServiceChange = (serviceId: string) => {
    const service = dryCleaningServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(serviceId);
      
      // Set default price (either fixed or minimum from range)
      if ('price' in service) {
        setSelectedPrice(service.price);
      } else if ('priceRange' in service) {
        setSelectedPrice(service.priceRange[0]);
      }
    }
  };
  
  const handlePriceChange = (price: number) => {
    setSelectedPrice(price);
  };
  
  const incrementItemQuantity = () => {
    setItemQuantity(prev => prev + 1);
  };
  
  const decrementItemQuantity = () => {
    if (itemQuantity > 1) {
      setItemQuantity(prev => prev - 1);
    }
  };
  
  const addServiceToTicket = () => {
    if (!selectedService) {
      toast.error('Por favor seleccione un servicio');
      return;
    }
    
    const service = dryCleaningServices.find(s => s.id === selectedService);
    if (service) {
      const newItem = {
        id: service.id,
        name: service.name,
        price: selectedPrice,
        quantity: itemQuantity
      };
      
      setSelectedItems([...selectedItems, newItem]);
      
      // Reset selection
      setSelectedService('');
      setSelectedPrice(0);
      setItemQuantity(1);
      
      toast.success(`Servicio añadido: ${service.name} x${itemQuantity}`);
    }
  };
  
  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
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
      // Store ticket data
      const success = await storeTicketData(
        {
          ticketNumber: nextTicketNumber,
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
          description: `Ticket #${nextTicketNumber} para ${clientName}`,
        });
        
        // Reset form
        setClientName('');
        setPhoneNumber('');
        setValetQuantity(1);
        setSelectedOptions([]);
        setPaymentMethod('cash');
        setSelectedItems([]);
        
        // Increment the ticket number for the next submission
        setNextTicketNumber((parseInt(nextTicketNumber) + 1).toString().padStart(8, '0'));
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
          
          <div className="space-y-4 border-t pt-4">
            <h4 className="mb-3 font-medium">Seleccione un servicio:</h4>
            <div className="grid grid-cols-1 gap-3">
              <Select value={selectedService} onValueChange={handleServiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {dryCleaningServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {
                        'price' in service 
                          ? `$${service.price.toLocaleString()}`
                          : `$${service.priceRange[0].toLocaleString()} - $${service.priceRange[1].toLocaleString()}`
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedService && 'priceRange' in (dryCleaningServices.find(s => s.id === selectedService) || {}) && (
                <div className="space-y-2">
                  <Label>Precio:</Label>
                  <Input
                    type="number"
                    value={selectedPrice}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    min={(dryCleaningServices.find(s => s.id === selectedService)?.priceRange || [])[0]}
                    max={(dryCleaningServices.find(s => s.id === selectedService)?.priceRange || [])[1]}
                  />
                  <p className="text-xs text-muted-foreground">
                    Rango: ${(dryCleaningServices.find(s => s.id === selectedService)?.priceRange || [])[0].toLocaleString()} - 
                    ${(dryCleaningServices.find(s => s.id === selectedService)?.priceRange || [])[1].toLocaleString()}
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Cantidad:</Label>
                <div className="flex items-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-10 w-10 rounded-full p-0"
                    onClick={decrementItemQuantity}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    className="w-16 text-center"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-10 w-10 rounded-full p-0"
                    onClick={incrementItemQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={addServiceToTicket}
                className="bg-green-600 hover:bg-green-700 flex gap-2 mt-2"
              >
                <Plus size={16} /> <ShoppingCart size={16} /> Agregar al Ticket
              </Button>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="mb-3 font-medium">Servicios Agregados:</h4>
                <ul className="space-y-2">
                  {selectedItems.map((item, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm text-gray-600"> x{item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4 mt-4">
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
        <div className="flex justify-between">
          <span className="font-medium">Subtotal Valet ({valetQuantity}):</span>
          <span>$ {(pricePerValet * valetQuantity).toLocaleString()}</span>
        </div>
        {selectedItems.length > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">Subtotal Servicios:</span>
            <span>$ {selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
          </div>
        )}
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
