
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';

interface MetricsData {
  totalTickets: number;
  totalRevenue: number;
  avgTicketValue: number;
  totalCustomers: number;
  readyTickets: number;
  deliveredTickets: number;
  pendingTickets: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  serviceDistribution: Array<{ name: string; count: number }>;
  paymentMethods: Array<{ method: string; count: number }>;
  dailyTickets: Array<{ date: string; count: number }>;
}

const Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Get tickets data
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('is_canceled', false);

      if (ticketsError) throw ticketsError;

      // Get customers count
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id');

      if (customersError) throw customersError;

      // Get dry cleaning items for service distribution
      const { data: services, error: servicesError } = await supabase
        .from('dry_cleaning_items')
        .select('name, quantity');

      if (servicesError) throw servicesError;

      // Process data
      const totalTickets = tickets?.length || 0;
      const totalRevenue = tickets?.reduce((sum, ticket) => sum + (ticket.total || 0), 0) || 0;
      const avgTicketValue = totalTickets > 0 ? totalRevenue / totalTickets : 0;
      const totalCustomers = customers?.length || 0;

      // Status distribution
      const readyTickets = tickets?.filter(t => t.status === 'ready').length || 0;
      const deliveredTickets = tickets?.filter(t => t.status === 'delivered').length || 0;
      const pendingTickets = tickets?.filter(t => t.status === 'pending').length || 0;

      // Monthly revenue (last 6 months)
      const monthlyData: { [key: string]: number } = {};
      tickets?.forEach(ticket => {
        const date = new Date(ticket.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (ticket.total || 0);
      });

      const monthlyRevenue = Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, revenue]) => ({ month, revenue }));

      // Service distribution
      const serviceCount: { [key: string]: number } = {};
      services?.forEach(service => {
        serviceCount[service.name] = (serviceCount[service.name] || 0) + (service.quantity || 1);
      });

      const serviceDistribution = Object.entries(serviceCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Payment methods distribution
      const paymentCount: { [key: string]: number } = {};
      tickets?.forEach(ticket => {
        const method = ticket.payment_method || 'No especificado';
        paymentCount[method] = (paymentCount[method] || 0) + 1;
      });

      const paymentMethods = Object.entries(paymentCount)
        .map(([method, count]) => ({ method, count }));

      // Daily tickets (last 7 days)
      const dailyData: { [key: string]: number } = {};
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      last7Days.forEach(date => {
        dailyData[date] = 0;
      });

      tickets?.forEach(ticket => {
        const date = ticket.created_at.split('T')[0];
        if (dailyData.hasOwnProperty(date)) {
          dailyData[date]++;
        }
      });

      const dailyTickets = Object.entries(dailyData)
        .map(([date, count]) => ({ date, count }));

      setMetrics({
        totalTickets,
        totalRevenue,
        avgTicketValue,
        totalCustomers,
        readyTickets,
        deliveredTickets,
        pendingTickets,
        monthlyRevenue,
        serviceDistribution,
        paymentMethods,
        dailyTickets
      });

    } catch (err) {
      console.error('Error loading metrics:', err);
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Cargando métricas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Métricas del Sistema</h1>
        <Badge variant="outline">Datos en tiempo real</Badge>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.avgTicketValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de tickets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tickets Listos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.readyTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tickets Entregados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.deliveredTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tickets Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.pendingTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="services">Servicios</TabsTrigger>
          <TabsTrigger value="payment">Métodos de Pago</TabsTrigger>
          <TabsTrigger value="daily">Tickets Diarios</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Ingresos Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.serviceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percent }) => `${method} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {metrics.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Tickets Diarios (Últimos 7 días)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.dailyTickets}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;
