
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import { TicketAnalytics } from '@/lib/analyticsService';

interface ChartTabsProps {
  analytics: TicketAnalytics | null;
}

const ChartTabs = ({ analytics }: ChartTabsProps) => {
  // Prepare chart data
  const preparePaymentMethodData = () => {
    if (!analytics) return [];
    
    return Object.entries(analytics.paymentMethodDistribution).map(([name, value]) => ({
      name: name === 'cash' ? 'Efectivo' :
            name === 'debit' ? 'Débito' :
            name === 'mercadopago' ? 'MercadoPago' :
            name === 'cuentadni' ? 'Cuenta DNI' : name,
      value
    }));
  };
  
  const prepareRevenueChartData = () => {
    if (!analytics) return [];
    
    return analytics.revenueByMonth.map(item => ({
      name: item.month,
      income: parseFloat(item.revenue.toFixed(2)),
      expenses: 0 // Adding default expenses value to match LineChart data type
    }));
  };
  
  const prepareItemDistributionData = () => {
    if (!analytics) return [];
    
    // Get top 10 items by quantity
    return Object.entries(analytics.itemTypeDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        total: value
      }));
  };

  if (!analytics) {
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
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }

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
