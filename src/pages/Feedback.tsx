import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomerByPhone } from '@/lib/dataService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Loading } from '@/components/ui/loading';

const Feedback = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!queryClient) {
      console.error("QueryClient not available in Feedback component");
    }
  }, [queryClient]);
  
  const { data: customer, refetch, isLoading } = useQuery({
    queryKey: ['customer', phoneNumber],
    queryFn: async () => {
      if (!phoneNumber) return null;
      try {
        return await getCustomerByPhone(phoneNumber);
      } catch (error) {
        console.error("Error fetching customer:", error);
        return null;
      }
    },
    enabled: false,
    retry: false,
  });
  
  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      toast("Por favor ingrese un número de teléfono", {
        style: { backgroundColor: 'red', color: 'white' }
      });
      return;
    }
    
    try {
      await refetch();
      
      if (!customer) {
        toast("Cliente no encontrado", {
          style: { backgroundColor: 'red', color: 'white' }
        });
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      toast("Error al buscar el cliente", {
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };
  
  const handleFeedbackAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  
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
