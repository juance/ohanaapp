
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import { ArrowLeft, TrendingUp, CreditCard, Calendar, Users, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardData } from '@/hooks/useDashboardData';

const Metrics = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { metrics, loading, chartData } = useDashboardData(period);
  
  const handlePeriodChange = (value: string) => {
    setPeriod(value as 'daily' | 'weekly' | 'monthly');
  };
  
  // Helper function to get payment method value based on period
  const getPaymentMethodValue = (method: 'cash' | 'debit' | 'mercadoPago' | 'cuentaDni') => {
    if (period === 'daily') {
      return metrics.daily?.paymentMethods?.[method] || 0;
    } else if (period === 'weekly') {
      return metrics.weekly?.paymentMethods?.[method] || 0;
    } else {
      return metrics.monthly?.paymentMethods?.[method] || 0;
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center text-blue-600 hover:underline mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-600">Métricas</h1>
              <p className="text-gray-500">Visualización de datos y estadísticas</p>
            </div>
          </header>
          
          <Tabs defaultValue="daily" onValueChange={handlePeriodChange}>
            <TabsList className="mb-6 grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
            </TabsList>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? 'Cargando...' : `$${period === 'daily' ? 
                      metrics.daily?.totalSales : period === 'weekly' ? 
                      Object.values(metrics.weekly?.salesByDay || {}).reduce((sum, value) => sum + value, 0) : 
                      Object.values(metrics.monthly?.salesByWeek || {}).reduce((sum, value) => sum + value, 0)}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {period === 'daily' ? 'Ventas del día' : 
                     period === 'weekly' ? 'Ventas de la semana' : 
                     'Ventas del mes'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cantidad de Valets</CardTitle>
                  <PackageOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? 'Cargando...' : period === 'daily' ? 
                      metrics.daily?.valetCount : period === 'weekly' ? 
                      Object.values(metrics.weekly?.valetsByDay || {}).reduce((sum, value) => sum + value, 0) : 
                      Object.values(metrics.monthly?.valetsByWeek || {}).reduce((sum, value) => sum + value, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {period === 'daily' ? 'Valets del día' : 
                     period === 'weekly' ? 'Valets de la semana' : 
                     'Valets del mes'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Método de Pago Principal</CardTitle>
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? 'Cargando...' : period === 'daily' ? 
                      Object.entries(metrics.daily?.paymentMethods || {})
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 
                      Object.entries(metrics.weekly?.paymentMethods || {})
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' : 
                      Object.entries(metrics.monthly?.paymentMethods || {})
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Método de pago más utilizado
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Frecuentes</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    Clientes con más de 3 visitas
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart data={chartData.barData} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos vs Gastos</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart data={chartData.lineData} />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Métodos de Pago</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <PieChart data={[
                    { name: 'Efectivo', value: getPaymentMethodValue('cash') },
                    { name: 'Débito', value: getPaymentMethodValue('debit') },
                    { name: 'Mercado Pago', value: getPaymentMethodValue('mercadoPago') },
                    { name: 'Cuenta DNI', value: getPaymentMethodValue('cuentaDni') }
                  ]} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Solicitados</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <PieChart data={chartData.pieData} />
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
