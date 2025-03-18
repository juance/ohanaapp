
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useDashboardData } from '@/hooks/useDashboardData';
import MetricsCards from '@/components/dashboard/MetricsCards';
import ChartSection from '@/components/dashboard/ChartSection';
import LoadingState from '@/components/dashboard/LoadingState';

const Dashboard = () => {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Use our custom hook
  const { 
    loading, 
    metrics, 
    expenses,
    frequentClients, 
    chartData,
    refreshData 
  } = useDashboardData(viewType);
  
  // If data is loading, show loading state
  if (loading) {
    return <LoadingState />;
  }
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Monitorea el rendimiento y analíticas de tu lavandería
            </p>
          </div>
          
          <Tabs defaultValue="daily" className="mb-8" onValueChange={(value) => setViewType(value as any)}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-xl font-semibold">Métricas de Rendimiento</h2>
              <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                <TabsTrigger value="daily">Diario</TabsTrigger>
                <TabsTrigger value="weekly">Semanal</TabsTrigger>
                <TabsTrigger value="monthly">Mensual</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="daily" className="mt-6 animate-fade-in">
              <MetricsCards viewType="daily" metrics={metrics} expenses={expenses} />
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6 animate-fade-in">
              <MetricsCards viewType="weekly" metrics={metrics} expenses={expenses} />
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6 animate-fade-in">
              <MetricsCards viewType="monthly" metrics={metrics} expenses={expenses} />
            </TabsContent>
          </Tabs>
          
          <ChartSection 
            viewType={viewType} 
            chartData={chartData} 
            frequentClients={frequentClients} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
