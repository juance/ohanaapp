
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InventoryList from '@/components/InventoryList';
import FeedbackForm from '@/components/FeedbackForm';
import FeedbackList from '@/components/FeedbackList';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inventory = () => {
  const [refreshFeedback, setRefreshFeedback] = useState(0);

  const handleFeedbackAdded = () => {
    setRefreshFeedback(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver</span>
            </Link>
            <h1 className="text-2xl font-bold">Administración del Negocio</h1>
            <p className="text-gray-500">Gestión de inventario y comentarios de clientes</p>
          </header>
          
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="feedback">Comentarios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Inventario de Suministros</h2>
                <InventoryList />
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Comentarios de Clientes</h2>
                  <FeedbackList refreshTrigger={refreshFeedback} />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Nuevo Comentario</h2>
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
