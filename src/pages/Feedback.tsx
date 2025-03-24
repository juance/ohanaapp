
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { useQuery } from '@tanstack/react-query';
import { getCustomerByPhone } from '@/lib/dataService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Por favor ingrese un número de teléfono'
      });
      return;
    }
    
    await refetch();
    
    if (!customer) {
      toast({
        variant: "destructive",
        title: "Error",
        description: 'Cliente no encontrado'
      });
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Comentarios</h1>
            <p className="mt-1 text-muted-foreground">
              Gestiona los comentarios de clientes
            </p>
          </div>
          
          <div className="mb-6">
            <Link to="/administration" className="text-blue-600 hover:underline flex items-center">
              Ver programa de fidelidad completo en Administración/Clientes
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
          <FeedbackList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Feedback;
