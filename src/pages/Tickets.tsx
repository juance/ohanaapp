
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import SimpleTicketForm from '@/components/SimpleTicketForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tickets = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
              <p className="text-gray-500">Sistema de Tickets</p>
            </div>
          </header>
          
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="metricas">Métricas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="pt-4">
              <SimpleTicketForm />
            </TabsContent>
            
            <TabsContent value="metricas" className="pt-4">
              <div className="text-center">
                <p className="text-lg text-gray-600">Las métricas están disponibles en la sección de Métricas</p>
                <Link to="/metrics">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Ver Métricas
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
