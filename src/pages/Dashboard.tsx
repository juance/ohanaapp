
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Shirt,
  Droplets,
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import DateRangeSelector from '@/components/shared/DateRangeSelector';

const Dashboard = () => {
  const {
    isLoading,
    dateRange,
    setDateRange,
    ticketsInRange,
    incomeInRange,
    serviceCounts,
    dryCleaningItems
  } = useDashboardData();

  // Calculate metrics
  const totalTickets = ticketsInRange.length;
  const pendingTickets = ticketsInRange.filter(t => t.status === 'pending').length;
  const completedTickets = ticketsInRange.filter(t => t.status === 'delivered').length;
  const averageTicketValue = totalTickets > 0 ? incomeInRange / totalTickets : 0;

  // Prepare chart data
  const serviceData = [
    { name: 'Valet', value: serviceCounts.valet, color: '#3B82F6' },
    { name: 'Lavandería', value: serviceCounts.lavanderia, color: '#10B981' },
    { name: 'Tintorería', value: serviceCounts.tintoreria, color: '#F59E0B' }
  ];

  const dryCleaningData = Object.entries(dryCleaningItems).map(([name, value]) => ({
    name,
    value: Number(value),
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  // Mock daily revenue data for the line chart
  const dailyRevenueData = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'short' }),
    revenue: Math.floor(Math.random() * 1000) + 200
  }));

  const handleDateRangeChange = (from: Date, to: Date) => {
    setDateRange({ start: from, end: to });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen del rendimiento de Lavandería Ohana</p>
        </div>
        <div className="flex items-center space-x-4">
          <DateRangeSelector 
            from={dateRange.start} 
            to={dateRange.end} 
            onUpdate={handleDateRangeChange}
          />
          <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Últimos {Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))} días
          </Badge>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${incomeInRange.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% respecto al período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTickets} pendientes, {completedTickets} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageTicketValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Por ticket procesado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(ticketsInRange.map(t => t.customers?.phone || t.customer_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes atendidos en el período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribución de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendencia de Ingresos (7 días)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Ingresos']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Servicios
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Artículos de Tintorería
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Estado de Tickets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Servicio Valet</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{serviceCounts.valet}</div>
                    <div className="text-sm text-gray-500">servicios</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Lavandería</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{serviceCounts.lavanderia}</div>
                    <div className="text-sm text-gray-500">servicios</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Tintorería</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{serviceCounts.tintoreria}</div>
                    <div className="text-sm text-gray-500">servicios</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artículos de Tintorería Más Procesados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dryCleaningData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTickets}</div>
                <p className="text-xs text-muted-foreground">tickets en proceso</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTickets}</div>
                <p className="text-xs text-muted-foreground">tickets entregados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Atrasados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">tickets vencidos</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Package className="h-6 w-6" />
              <span className="text-sm">Nuevo Ticket</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">Gestionar Clientes</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Ver Métricas</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Droplets className="h-6 w-6" />
              <span className="text-sm">Inventario</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
