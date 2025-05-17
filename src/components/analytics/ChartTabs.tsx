
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketAnalytics } from '@/lib/analytics/interfaces';
import { BarChart, PieChart, ResponsiveContainer } from '@/components/ui/custom-charts';
import { BarChart3, PieChart as PieChartIcon, DollarSign, LineChart } from 'lucide-react';

interface ChartTabsProps {
  loading: boolean;
  analytics: TicketAnalytics | null;
}

const ChartTabs = ({ loading, analytics }: ChartTabsProps) => {
  const [activeTab, setActiveTab] = useState('revenue');
  
  // Monthly revenue data
  const revenueByMonthData = analytics?.revenueByMonth?.map(item => ({
    name: new Date(item.month).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }),
    total: item.revenue
  })) || [];
  
  // Payment methods data
  const paymentMethodData = analytics?.paymentMethodDistribution ? 
    Object.entries(analytics.paymentMethodDistribution).map(([method, count]) => ({
      name: formatPaymentMethod(method),
      value: count
    })) : [];
  
  // Item type distribution data
  const itemTypeData = analytics?.itemTypeDistribution ? 
    Object.entries(analytics.itemTypeDistribution).map(([type, count]) => ({
      name: type,
      value: count
    })) : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="revenue" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Rendimiento Mensual</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Servicios Populares</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Distribución de Pagos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {revenueByMonthData.length > 0 ? (
                  <BarChart data={revenueByMonthData} />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No hay datos de ingresos disponibles para el período seleccionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Servicios Más Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {itemTypeData.length > 0 ? (
                  <PieChart data={itemTypeData} />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No hay datos de servicios disponibles para el período seleccionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {paymentMethodData.length > 0 ? (
                  <PieChart data={paymentMethodData} />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No hay datos de pagos disponibles para el período seleccionado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to format payment method names
const formatPaymentMethod = (method: string): string => {
  const methodMap: Record<string, string> = {
    'cash': 'Efectivo',
    'debit': 'Débito',
    'credit': 'Crédito',
    'mercadopago': 'Mercado Pago',
    'cuentadni': 'Cuenta DNI',
    'transfer': 'Transferencia'
  };
  
  return methodMap[method.toLowerCase()] || method;
};

export default ChartTabs;
