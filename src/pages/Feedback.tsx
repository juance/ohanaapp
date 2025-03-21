
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import LoyaltyInfo from '@/components/LoyaltyInfo';
import { useQuery } from '@tanstack/react-query';
import { getCustomerByPhone } from '@/lib/customerService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const Feedback = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const isMobile = useIsMobile();
  
  const { data: customer, refetch, isLoading } = useQuery({
    queryKey: ['customer', phoneNumber],
    queryFn: async () => {
      if (!phoneNumber) return null;
      return await getCustomerByPhone(phoneNumber);
    },
    enabled: false, // Don't run automatically
  });
  
  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Por favor ingrese un número de teléfono');
      return;
    }
    
    await refetch();
    
    if (!customer) {
      toast.error('Cliente no encontrado');
    }
  };
  
  const handleFeedbackAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comentarios y Fidelidad</h1>
            <p className="mt-1 text-muted-foreground">
              Gestiona los comentarios de clientes y visualiza el programa de fidelidad
            </p>
          </div>
          
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="feedback" className="flex-1">Comentarios</TabsTrigger>
              <TabsTrigger value="loyalty" className="flex-1">Programa de Fidelidad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="feedback" className="space-y-4">
              <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
              <FeedbackList refreshTrigger={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="loyalty" className="space-y-4">
              <div className="w-full mb-4">
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <Input
                    placeholder="Buscar cliente por teléfono"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className={isMobile ? "w-full" : ""}
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
                
                {customer ? (
                  <LoyaltyInfo 
                    valetsCount={customer.valets_count || 0} 
                    freeValets={customer.free_valets || 0} 
                  />
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-600">
                      Busque un cliente por teléfono para ver su información de fidelidad
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
