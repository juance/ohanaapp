
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import MetricsCard from '@/components/MetricsCard';
import Navbar from '@/components/Navbar';
import { BarChart3, TrendingUp, DollarSign, UsersRound, Calendar } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { ClientVisit } from '@/lib/types';

const Dashboard = () => {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const navigate = useNavigate();
  
  // Use our custom hook
  const { 
    loading, 
    metrics, 
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
              <p className="mt-1 text-muted-foreground">Loading metrics...</p>
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
              Monitor your laundry's performance and analytics
            </p>
          </div>
          
          <Tabs defaultValue="daily" className="mb-8" onValueChange={(value) => setViewType(value as any)}>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-xl font-semibold">Performance Metrics</h2>
              <TabsList className="grid w-full max-w-[400px] grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="daily" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Income"
                  value={formatCurrency(metrics.daily?.totalSales || 0)}
                  description="Today's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={metrics.daily?.valetCount || 0}
                  description="Valets processed today"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="Cash Payments"
                  value={formatCurrency(metrics.daily?.paymentMethods.cash || 0)}
                  description="Today's cash revenue"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 5, isPositive: true }}
                />
                <MetricsCard
                  title="Digital Payments"
                  value={formatCurrency(
                    (metrics.daily?.paymentMethods.debit || 0) + 
                    (metrics.daily?.paymentMethods.mercadoPago || 0) + 
                    (metrics.daily?.paymentMethods.cuentaDni || 0)
                  )}
                  description="Today's digital revenue"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 15, isPositive: true }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Income"
                  value={formatCurrency(
                    Object.values(metrics.weekly?.salesByDay || {}).reduce((acc, val) => acc + val, 0)
                  )}
                  description="This week's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={
                    Object.values(metrics.weekly?.valetsByDay || {}).reduce((acc, val) => acc + val, 0)
                  }
                  description="Valets processed this week"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="Cash Payments"
                  value={formatCurrency(metrics.weekly?.paymentMethods.cash || 0)}
                  description="This week's cash revenue"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 3, isPositive: true }}
                />
                <MetricsCard
                  title="Digital Payments"
                  value={formatCurrency(
                    (metrics.weekly?.paymentMethods.debit || 0) + 
                    (metrics.weekly?.paymentMethods.mercadoPago || 0) + 
                    (metrics.weekly?.paymentMethods.cuentaDni || 0)
                  )}
                  description="This week's digital revenue"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 10, isPositive: true }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Income"
                  value={formatCurrency(
                    Object.values(metrics.monthly?.salesByWeek || {}).reduce((acc, val) => acc + val, 0)
                  )}
                  description="This month's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricsCard
                  title="Valets"
                  value={
                    Object.values(metrics.monthly?.valetsByWeek || {}).reduce((acc, val) => acc + val, 0)
                  }
                  description="Valets processed this month"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 20, isPositive: true }}
                />
                <MetricsCard
                  title="Cash Payments"
                  value={formatCurrency(metrics.monthly?.paymentMethods.cash || 0)}
                  description="This month's cash revenue"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 18, isPositive: true }}
                />
                <MetricsCard
                  title="Digital Payments"
                  value={formatCurrency(
                    (metrics.monthly?.paymentMethods.debit || 0) + 
                    (metrics.monthly?.paymentMethods.mercadoPago || 0) + 
                    (metrics.monthly?.paymentMethods.cuentaDni || 0)
                  )}
                  description="This month's digital revenue"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 25, isPositive: true }}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
                <CardDescription>
                  {viewType === 'daily' && 'Today\'s revenue by hour'}
                  {viewType === 'weekly' && 'This week\'s daily revenue'}
                  {viewType === 'monthly' && 'This month\'s weekly revenue'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart data={chartData.barData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Service Distribution</CardTitle>
                <CardDescription>
                  Breakdown of services requested
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart data={chartData.pieData.length > 0 ? chartData.pieData : [
                  { name: 'No Data', value: 1 }
                ]} />
              </CardContent>
            </Card>
            
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Income vs Expenses</CardTitle>
                <CardDescription>
                  Comparison of income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart data={chartData.lineData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Frequent Clients</CardTitle>
                <CardDescription>
                  Clients with most visits
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
                            <span>{client.visitCount} visits</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No client visit data available
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
