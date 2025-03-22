
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Inventory from './Inventory';
import Clients from './Clients';
import Metrics from './Metrics';
import TicketAnalysis from './TicketAnalysis';

interface EmbeddableProps {
  embedded?: boolean;
}

const Administration = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
            <p className="text-gray-500">Administración</p>
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inventory">Inventario</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="metrics">Métricas</TabsTrigger>
              <TabsTrigger value="ticket-analysis">Análisis de Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <Dashboard embedded={true} />
            </TabsContent>
            
            <TabsContent value="inventory">
              <Inventory embedded={true} />
            </TabsContent>
            
            <TabsContent value="clients">
              <Clients />
            </TabsContent>
            
            <TabsContent value="metrics">
              <Metrics embedded={true} />
            </TabsContent>
            
            <TabsContent value="ticket-analysis">
              <TicketAnalysis embedded={true} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Administration;
