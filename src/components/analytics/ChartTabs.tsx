
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TicketAnalytics } from '@/lib/analytics/interfaces';

interface ChartTabsProps {
  loading: boolean;
  analytics: TicketAnalytics;
}

const ChartTabs: React.FC<ChartTabsProps> = ({ loading, analytics }) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusData = [
    { name: 'Pendientes', value: analytics.ticketsByStatus.pending, color: '#f59e0b' },
    { name: 'Listos', value: analytics.ticketsByStatus.ready, color: '#10b981' },
    { name: 'Entregados', value: analytics.ticketsByStatus.delivered, color: '#3b82f6' }
  ];

  const paymentData = Object.entries(analytics.paymentMethodDistribution).map(([method, count]) => ({
    name: method,
    value: count
  }));

  const itemsData = Object.entries(analytics.itemTypeDistribution).slice(0, 8).map(([item, count]) => ({
    name: item,
    value: count
  }));

  return (
    <Tabs defaultValue="status" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="status">Estado de Tickets</TabsTrigger>
        <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
        <TabsTrigger value="items">Items Más Procesados</TabsTrigger>
      </TabsList>

      <TabsContent value="status">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="items">
        <Card>
          <CardHeader>
            <CardTitle>Items Más Procesados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={itemsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ChartTabs;
