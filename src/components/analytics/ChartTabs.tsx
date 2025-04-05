
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';

interface ChartTabsProps {
  chartData: any;
}

const ChartTabs = ({ chartData }: ChartTabsProps) => {
  // Safe accessor with fallbacks
  const safeData = chartData || {
    revenueByMonth: [],
    itemTypeDistribution: {},
    paymentMethodDistribution: {}
  };
  
  // Prepare chart data
  const preparePaymentMethodData = () => {
    const distribution = safeData.paymentMethodDistribution || {};
    
    return Object.entries(distribution).map(([name, value]) => ({
      name: name === 'cash' ? 'Efectivo' :
            name === 'debit' ? 'Débito' :
            name === 'mercadopago' ? 'MercadoPago' :
            name === 'cuentadni' ? 'Cuenta DNI' : name,
      value: Number(value) // Convert to number to fix type error
    }));
  };
  
  const prepareRevenueChartData = () => {
    const revenueData = safeData.revenueByMonth || [];
    
    return revenueData.map(item => ({
      name: item.month,
      // Ensure we're working with numbers before arithmetic operations
      income: Number(parseFloat(String(item.revenue || 0)).toFixed(2)),
      expenses: 0 // Adding default expenses value to match LineChart data type
    }));
  };
  
  const prepareItemDistributionData = () => {
    const distribution = safeData.itemTypeDistribution || {};
    
    // Get top 10 items by quantity
    return Object.entries(distribution)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        total: Number(value) // Convert to number to fix type error
      }));
  };

  return (
    <Tabs defaultValue="revenue">
      <TabsList>
        <TabsTrigger value="revenue">Ingresos</TabsTrigger>
        <TabsTrigger value="items">Artículos</TabsTrigger>
        <TabsTrigger value="payment">Métodos de Pago</TabsTrigger>
      </TabsList>
      
      <TabsContent value="revenue" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Mes</CardTitle>
            <CardDescription>
              Análisis de tendencia de ingresos en el período seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <LineChart data={prepareRevenueChartData()} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="items" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Artículos</CardTitle>
            <CardDescription>
              Los 10 artículos más procesados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <BarChart data={prepareItemDistributionData()} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="payment" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
            <CardDescription>
              Distribución de métodos de pago utilizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <PieChart data={preparePaymentMethodData()} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ChartTabs;
