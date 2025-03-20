
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InventoryList from '@/components/InventoryList';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const Inventory = () => {
  const [refreshFeedback, setRefreshFeedback] = useState(0);
  const isMobile = useIsMobile();

  const handleFeedbackAdded = () => {
    setRefreshFeedback(prev => prev + 1);
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
            <p className="text-sm md:text-base text-gray-500">Gestión de inventario y comentarios de clientes</p>
          </header>
          
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4 md:mb-6">
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="feedback">Comentarios</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
