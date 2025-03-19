
import { useState } from 'react';
import { Calendar as CalendarIcon, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTicketAnalytics } from '@/hooks/useTicketAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import MetricsCard from '@/components/MetricsCard';
import { BarChart, LineChart, PieChart, ResponsiveContainer } from '@/components/ui/custom-charts';

const TicketAnalysis = () => {
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  });
  const { loading, analytics, refreshData } = useTicketAnalytics(dateRange.from, dateRange.to);
  
  const handleRefresh = async () => {
    await refreshData(dateRange.from, dateRange.to);
    toast.success('Datos actualizados');
  };
  
  const handleDownloadCSV = () => {
    if (!analytics) return;
    
    // Generate CSV content
    const csvContent = [
      // Headers
      ['Fecha', 'Total Tickets', 'Ingreso Promedio', 'Ingreso Total'].join(','),
      // Data
      [
        format(new Date(), 'dd/MM/yyyy'),
        analytics.totalTickets,
        analytics.averageTicketValue.toFixed(2),
        analytics.totalRevenue.toFixed(2)
      ].join(',')
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis_tickets_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Reporte CSV descargado');
  };
  
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
      total: parseFloat(item.revenue.toFixed(2))
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
  
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      
      <div className="flex-1 md:ml-64">
        <div className="container mx-auto p-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Análisis de Tickets</h1>
              <p className="text-muted-foreground">
                Análisis detallado de ventas y tickets
              </p>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left sm:w-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yy', { locale: es })} -{' '}
                          {format(dateRange.to, 'dd/MM/yy', { locale: es })}
                        </>
                      ) : (
                        format(dateRange.from, 'PP', { locale: es })
                      )
                    ) : (
                      <span>Seleccionar rango</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                        refreshData(range.from, range.to);
                      }
                    }}
                    numberOfMonths={isMobile ? 1 : 2}
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
              
              <Button variant="outline" onClick={handleDownloadCSV} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <MetricsCard
                  title="Total de Tickets"
                  value={analytics?.totalTickets.toString() || '0'}
                  icon={<CalendarIcon className="h-4 w-4" />}
                />
                <MetricsCard
                  title="Valor Promedio"
                  value={`$${analytics?.averageTicketValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
                />
                <MetricsCard
                  title="Ingresos Totales"
                  value={`$${analytics?.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
                />
                <MetricsCard
                  title="Tickets Listos"
                  value={analytics?.ticketsByStatus?.ready?.toString() || '0'}
                />
              </>
            )}
          </div>
          
          <div className="mt-8">
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
                    {loading ? (
                      <Skeleton className="h-[350px] w-full" />
                    ) : (
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={prepareRevenueChartData()} />
                        </ResponsiveContainer>
                      </div>
                    )}
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
                    {loading ? (
                      <Skeleton className="h-[350px] w-full" />
                    ) : (
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={prepareItemDistributionData()} />
                        </ResponsiveContainer>
                      </div>
                    )}
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
                    {loading ? (
                      <Skeleton className="h-[350px] w-full" />
                    ) : (
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart data={preparePaymentMethodData()} />
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAnalysis;
