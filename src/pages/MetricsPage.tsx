
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, DollarSign, Users, Package, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DateFilterButtons } from '@/components/analytics/DateFilterButtons';
import { DateRange, DateFilterType } from '@/lib/analytics/interfaces';
import { Loading } from '@/components/ui/loading';
import { useDashboardData } from '@/hooks/useDashboardData';
import { format, subDays, subMonths } from 'date-fns';

const MetricsPage = () => {
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('month');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });

  const { data: dashboardData, isLoading, error } = useDashboardData();

  // Datos simulados para gráficos
  const revenueData = [
    { month: 'Ene', revenue: 65000, orders: 120 },
    { month: 'Feb', revenue: 72000, orders: 135 },
    { month: 'Mar', revenue: 68000, orders: 128 },
    { month: 'Abr', revenue: 84000, orders: 156 },
    { month: 'May', revenue: 91000, orders: 172 },
    { month: 'Jun', revenue: 87000, orders: 165 },
  ];

  const serviceData = [
    { name: 'Lavado Estándar', value: 45, color: '#8884d8' },
    { name: 'Lavado Premium', value: 30, color: '#82ca9d' },
    { name: 'Tintorería', value: 15, color: '#ffc658' },
    { name: 'Planchado', value: 10, color: '#ff7c7c' },
  ];

  const dailyOrdersData = [
    { day: 'Lun', orders: 23, revenue: 4500 },
    { day: 'Mar', orders: 31, revenue: 6200 },
    { day: 'Mié', orders: 28, revenue: 5600 },
    { day: 'Jue', orders: 35, revenue: 7000 },
    { day: 'Vie', orders: 42, revenue: 8400 },
    { day: 'Sáb', orders: 38, revenue: 7600 },
    { day: 'Dom', orders: 25, revenue: 5000 },
  ];

  const handleExportData = async () => {
    const csvData = revenueData.map(item => 
      `${item.month},${item.revenue},${item.orders}`
    ).join('\n');
    
    const blob = new Blob([`Mes,Ingresos,Ordenes\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metricas_lavanderia.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Métricas de Rendimiento</h1>
          <p className="text-muted-foreground">
            Panel completo de análisis y estadísticas del negocio
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <DateFilterButtons
        onFilterChange={setDateRange}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$91,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3.1% vs mes anterior
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Mejoró 15 min
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ingresos']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
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
      </div>

      {/* Gráfico de órdenes diarias */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dailyOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Órdenes" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Ingresos" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eficiencia Operativa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Órdenes completadas a tiempo</span>
              <span className="font-semibold text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Satisfacción del cliente</span>
              <span className="font-semibold text-green-600">4.8/5</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa de retención</span>
              <span className="font-semibold text-blue-600">87.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análisis Financiero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Ticket promedio</span>
              <span className="font-semibold">$73.45</span>
            </div>
            <div className="flex justify-between">
              <span>Margen de ganancia</span>
              <span className="font-semibold text-green-600">34.2%</span>
            </div>
            <div className="flex justify-between">
              <span>Gastos operativos</span>
              <span className="font-semibold text-red-600">$28,450</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Crecimiento mensual</span>
              <span className="font-semibold text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Mejor día de la semana</span>
              <span className="font-semibold">Viernes</span>
            </div>
            <div className="flex justify-between">
              <span>Servicio más popular</span>
              <span className="font-semibold">Lavado Estándar</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsPage;
