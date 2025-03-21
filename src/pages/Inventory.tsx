
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, User } from 'lucide-react';
import InventoryList from '@/components/InventoryList';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import LoyaltyInfo from '@/components/LoyaltyInfo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { getCustomerByPhone } from '@/lib/customerService';

const Inventory = () => {
  const [refreshFeedback, setRefreshFeedback] = useState(0);
  const isMobile = useIsMobile();
  const [searchPhone, setSearchPhone] = useState('');
  const [customer, setCustomer] = useState<any>(null);

  const handleFeedbackAdded = () => {
    setRefreshFeedback(prev => prev + 1);
  };

  const handleCustomerSearch = async () => {
    if (!searchPhone || searchPhone.length < 8) {
      toast.error('Por favor ingrese un número de teléfono válido');
      return;
    }
    
    try {
      const result = await getCustomerByPhone(searchPhone);
      
      if (result) {
        setCustomer(result);
        toast.success(`Cliente encontrado: ${result.name}`);
      } else {
        setCustomer(null);
        toast.error('Cliente no encontrado');
      }
    } catch (error) {
      console.error('Error looking up customer:', error);
      setCustomer(null);
      toast.error('Error al buscar cliente');
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className={`flex-1 ${isMobile ? 'p-2' : 'md:ml-64 p-6'}`}>
        <div className="container mx-auto pt-4 md:pt-6">
          <header className="mb-6 md:mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2 text-sm md:text-base">
              <ArrowLeft className="mr-1 h-3 w-3 md:h-4 md:w-4" />
              <span>Volver</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Administración del Negocio</h1>
            <p className="text-sm md:text-base text-gray-500">Gestión de inventario, comentarios y programa de fidelidad</p>
          </header>
          
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-4 md:mb-6">
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="feedback">Comentarios</TabsTrigger>
              <TabsTrigger value="loyalty">Fidelidad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Inventario de Suministros</h2>
                <InventoryList />
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <div className="order-2 md:order-1">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Comentarios de Clientes</h2>
                  <FeedbackList refreshTrigger={refreshFeedback} />
                </div>
                
                <div className="order-1 md:order-2">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Nuevo Comentario</h2>
                  <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="loyalty">
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Programa de Fidelidad</h2>
                  <div className="bg-white rounded-lg shadow p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Buscar cliente por teléfono"
                          value={searchPhone}
                          onChange={(e) => setSearchPhone(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button onClick={handleCustomerSearch} className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span>Buscar</span>
                      </Button>
                    </div>
                    
                    {customer ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <User className="h-10 w-10 text-blue-500 bg-blue-100 p-2 rounded-full" />
                          <div>
                            <h3 className="font-medium">{customer.name}</h3>
                            <p className="text-sm text-gray-500">{customer.phoneNumber}</p>
                          </div>
                        </div>
                        
                        <LoyaltyInfo 
                          valetsCount={customer.valetsCount || 0} 
                          freeValets={customer.freeValets || 0} 
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2 text-gray-500">Busque un cliente para ver su información de fidelidad</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Información del Programa</h2>
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-medium text-lg mb-3">Cómo Funciona el Programa de Fidelidad</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <p>Por cada valet que compre el cliente, se registra automáticamente en su cuenta.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <p>Cuando el cliente acumula 9 valets, automáticamente recibe 1 valet gratis.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <p>Los valets gratis se pueden utilizar en cualquier momento durante su próxima visita.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                        <p>Para canjear un valet gratis, simplemente indíquelo al momento de crear un nuevo ticket.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                        <p>No hay límite en la cantidad de valets gratis que un cliente puede acumular.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
