
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SalesTrends } from '@/components/analytics/SalesTrends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientTrends } from '@/components/analytics/ClientTrends';
import { ServiceTrends } from '@/components/analytics/ServiceTrends';
import DateRangeSelector from '@/components/analysis/DateRangeSelector';

const TrendAnalysis: React.FC = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });

  const handleDateChange = (from: Date, to: Date) => {
    setDateRange({ from, to });
  };

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
            <p className="text-gray-500">Visualiza la evolución a lo largo del tiempo</p>
          </header>
          
          <div className="mb-6">
            <DateRangeSelector 
              from={dateRange.from} 
              to={dateRange.to} 
              onUpdate={handleDateChange}
            />
          </div>
          
          <Tabs defaultValue="sales">
            <TabsList className="mb-6">
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="services">Servicios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-6">
              <SalesTrends dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="clients" className="space-y-6">
              <ClientTrends dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-6">
              <ServiceTrends dateRange={dateRange} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
