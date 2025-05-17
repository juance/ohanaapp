
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart } from '@/components/ui/custom-charts';
import { TicketAnalytics } from '@/lib/types/analytics.types';
import { ChartData, LineChartData, BarChartData } from '@/lib/types/analytics.types';
import { Loading } from '@/components/ui/loading';

interface ChartTabsProps {
  analytics: TicketAnalytics;
  loading: boolean;
}

const ChartTabs: React.FC<ChartTabsProps> = ({ analytics, loading }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Revenue by month chart data
  const revenueData: LineChartData[] = analytics.revenueByMonth.map(item => ({
    name: item.month,
    income: item.revenue,
    expenses: 0 // We don't have expenses data in this example
  }));

  // Payment methods chart data
  const paymentMethodsData: ChartData[] = Object.entries(analytics.paymentMethodDistribution).map(
    ([name, value]) => ({ name, value })
  );

  // Service types chart data
  const serviceTypesData: ChartData[] = Object.entries(analytics.itemTypeDistribution).map(
    ([name, value]) => ({ name, value })
  );

  // Status chart data
  const statusData: BarChartData[] = [
    { name: 'Pendientes', total: analytics.ticketsByStatus.pending },
    { name: 'Listos', total: analytics.ticketsByStatus.ready },
    { name: 'Entregados', total: analytics.ticketsByStatus.delivered }
  ];

  if (loading) {
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Análisis de Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Ingresos</TabsTrigger>
            <TabsTrigger value="payment">Métodos de Pago</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="status">Estado</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <LineChart data={revenueData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Distribución de Métodos de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <PieChart data={paymentMethodsData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Tipos de Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <PieChart data={serviceTypesData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estado de Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <BarChart data={statusData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartTabs;
