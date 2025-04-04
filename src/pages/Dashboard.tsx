
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import MetricsCard from '@/components/MetricsCard';
import Navbar from '@/components/Navbar';
import { BarChart3, TrendingUp, DollarSign, UsersRound, Calendar, BanknoteIcon } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ClientVisit } from '@/lib/types';

const Dashboard = () => {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const navigate = useNavigate();
  
  // Use our custom hook
  const { 
    loading, 
    metrics, 
    expenses,
    frequentClients, 
    chartData,
    refreshData 
  } = useDashboardData(viewType);
  
  // Get the current metrics based on view type
  const currentMetrics = metrics[viewType];
  
  // Helper to format currency
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  
  // If data is loading, we could show a loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <Navbar />
        <div className="flex-1 md:ml-64">
          <div className="container mx-auto p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Cargando métricas...</p>
            </div>
          </div>
        </div>
      </div>
    );
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricsCard
                  title="Ingresos Totales"
                  value={formatCurrency(metrics.daily?.totalSales || 0)}
                  description="Ganancias de hoy"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={metrics.daily?.valetCount || 0}
                  description="Valets procesados hoy"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos en Efectivo"
                  value={formatCurrency(metrics.daily?.paymentMethods.cash || 0)}
                  description="Ingresos en efectivo de hoy"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 5, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos Digitales"
                  value={formatCurrency(
                    (metrics.daily?.paymentMethods.debit || 0) + 
                    (metrics.daily?.paymentMethods.mercadopago || 0) + 
                    (metrics.daily?.paymentMethods.cuentaDni || 0)
                  )}
                  description="Ingresos digitales de hoy"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricsCard
                  title="Gastos"
                  value={formatCurrency(expenses.daily || 0)}
                  description="Gastos de hoy"
                  icon={<BanknoteIcon className="h-4 w-4" />}
                  trend={{ value: 5, isPositive: false }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricsCard
                  title="Ingresos Totales"
                  value={formatCurrency(
                    Object.values(metrics.weekly?.salesByDay || {}).reduce((acc, val) => acc + val, 0)
                  )}
                  description="Ganancias de esta semana"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={
                    Object.values(metrics.weekly?.valetsByDay || {}).reduce((acc, val) => acc + val, 0)
                  }
                  description="Valets procesados esta semana"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos en Efectivo"
                  value={formatCurrency(metrics.weekly?.paymentMethods.cash || 0)}
                  description="Ingresos en efectivo de esta semana"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 3, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos Digitales"
                  value={formatCurrency(
                    (metrics.weekly?.paymentMethods.debit || 0) + 
                    (metrics.weekly?.paymentMethods.mercadopago || 0) + 
                    (metrics.weekly?.paymentMethods.cuentaDni || 0)
                  )}
                  description="Ingresos digitales de esta semana"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 10, isPositive: true }}
                />
                <MetricsCard
                  title="Gastos"
                  value={formatCurrency(expenses.weekly || 0)}
                  description="Gastos de esta semana"
                  icon={<BanknoteIcon className="h-4 w-4" />}
                  trend={{ value: 7, isPositive: false }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <MetricsCard
                  title="Ingresos Totales"
                  value={formatCurrency(
                    Object.values(metrics.monthly?.salesByWeek || {}).reduce((acc, val) => acc + val, 0)
                  )}
                  description="Ganancias de este mes"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={
                    Object.values(metrics.monthly?.valetsByWeek || {}).reduce((acc, val) => acc + val, 0)
                  }
                  description="Valets procesados este mes"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 20, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos en Efectivo"
                  value={formatCurrency(metrics.monthly?.paymentMethods.cash || 0)}
                  description="Ingresos en efectivo de este mes"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 18, isPositive: true }}
                />
                <MetricsCard
                  title="Pagos Digitales"
                  value={formatCurrency(
                    (metrics.monthly?.paymentMethods.debit || 0) + 
                    (metrics.monthly?.paymentMethods.mercadopago || 0) + 
                    (metrics.monthly?.paymentMethods.cuentaDni || 0)
                  )}
                  description="Ingresos digitales de este mes"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 25, isPositive: true }}
                />
                <MetricsCard
                  title="Gastos"
                  value={formatCurrency(expenses.monthly || 0)}
                  description="Gastos de este mes"
                  icon={<BanknoteIcon className="h-4 w-4" />}
                  trend={{ value: 10, isPositive: false }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Resumen de Ingresos</CardTitle>
                <CardDescription>
                  {viewType === 'daily' && 'Ingresos de hoy por hora'}
                  {viewType === 'weekly' && 'Ingresos diarios de esta semana'}
                  {viewType === 'monthly' && 'Ingresos semanales de este mes'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={chartData.barData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Distribución de Servicios</CardTitle>
                <CardDescription>
                  Desglose de servicios solicitados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={chartData.pieData.length > 0 ? chartData.pieData : [
                  { name: 'Sin Datos', value: 1 }
                ]} />
              </CardContent>
            </Card>
            
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Ingresos vs Gastos</CardTitle>
                <CardDescription>
                  Comparación de ingresos y gastos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={chartData.lineData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Clientes Frecuentes</CardTitle>
                <CardDescription>
                  Clientes con más visitas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {frequentClients.length > 0 ? (
                    frequentClients.slice(0, 5).map((client, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                        <div className="space-y-0.5">
                          <div className="font-medium">{client.clientName}</div>
                          <div className="text-xs text-muted-foreground">{client.phoneNumber}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{client.visitCount} visitas</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No hay datos de visitas de clientes disponibles
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
