
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SalesTrends } from '@/components/analytics/SalesTrends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TrendAnalysis: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto pt-6">
          <header className="mb-8">
            <Link to="/" className="mb-2 flex items-center text-blue-600 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-600">Análisis de Tendencias</h1>
            <p className="text-gray-500">Visualiza la evolución de ventas a lo largo del tiempo</p>
          </header>
          
          <Tabs defaultValue="sales">
            <TabsList className="mb-6">
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-6">
              <SalesTrends />
            </TabsContent>
            
            <TabsContent value="clients">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-medium text-amber-800">Próximamente</h3>
                <p className="text-amber-700">
                  El análisis de tendencias para clientes estará disponible próximamente.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="services">
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-medium text-amber-800">Próximamente</h3>
                <p className="text-amber-700">
                  El análisis de tendencias para servicios estará disponible próximamente.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
