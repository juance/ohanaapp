
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import MetricsCard from '@/components/MetricsCard';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth';
import { BarChart3, TrendingUp, DollarSign, UsersRound, Calendar } from 'lucide-react';
import { ClientVisit } from '@/lib/types';

// Mock data for metrics
const metricsData = {
  daily: {
    income: 3200,
    expenses: 850,
    tickets: 12,
    newClients: 3,
  },
  weekly: {
    income: 22400,
    expenses: 5950,
    tickets: 84,
    newClients: 21,
  },
  monthly: {
    income: 89600,
    expenses: 23800,
    tickets: 336,
    newClients: 84,
  },
};

// Mock data for frequent clients
const frequentClientsData: ClientVisit[] = [
  { phoneNumber: '+5493512345678', clientName: 'Maria Lopez', visitCount: 8, lastVisit: '2023-11-22' },
  { phoneNumber: '+5493512345679', clientName: 'Carlos Rodriguez', visitCount: 6, lastVisit: '2023-11-20' },
  { phoneNumber: '+5493512345680', clientName: 'Ana Martinez', visitCount: 5, lastVisit: '2023-11-18' },
  { phoneNumber: '+5493512345681', clientName: 'Juan Gomez', visitCount: 5, lastVisit: '2023-11-15' },
  { phoneNumber: '+5493512345682', clientName: 'Laura Fernandez', visitCount: 4, lastVisit: '2023-11-12' },
];

// Chart data
const barChartData = {
  data: [
    { name: 'Mon', total: 1200 },
    { name: 'Tue', total: 1800 },
    { name: 'Wed', total: 2200 },
    { name: 'Thu', total: 1800 },
    { name: 'Fri', total: 2400 },
    { name: 'Sat', total: 3200 },
    { name: 'Sun', total: 1800 },
  ],
};

const lineChartData = {
  data: [
    { name: 'Week 1', income: 21000, expenses: 6500 },
    { name: 'Week 2', income: 27000, expenses: 7800 },
    { name: 'Week 3', income: 24000, expenses: 6200 },
    { name: 'Week 4', income: 26000, expenses: 7100 },
  ],
};

const pieChartData = {
  data: [
    { name: 'Wash', value: 45 },
    { name: 'Dry', value: 30 },
    { name: 'Iron', value: 15 },
    { name: 'Fold', value: 10 },
  ],
};

const Dashboard = () => {
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
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
                  value={`$${metricsData.daily.income.toLocaleString()}`}
                  description="Today's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="Expenses"
                  value={`$${metricsData.daily.expenses.toLocaleString()}`}
                  description="Today's expenses"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 5, isPositive: false }}
                />
                <MetricsCard
                  title="Tickets"
                  value={metricsData.daily.tickets}
                  description="Tickets processed today"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="New Clients"
                  value={metricsData.daily.newClients}
                  description="First-time clients today"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 2, isPositive: true }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Income"
                  value={`$${metricsData.weekly.income.toLocaleString()}`}
                  description="This week's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricsCard
                  title="Expenses"
                  value={`$${metricsData.weekly.expenses.toLocaleString()}`}
                  description="This week's expenses"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 3, isPositive: false }}
                />
                <MetricsCard
                  title="Tickets"
                  value={metricsData.weekly.tickets}
                  description="Tickets processed this week"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
                />
                <MetricsCard
                  title="New Clients"
                  value={metricsData.weekly.newClients}
                  description="First-time clients this week"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 5, isPositive: true }}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className="mt-6 animate-fade-in">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricsCard
                  title="Total Income"
                  value={`$${metricsData.monthly.income.toLocaleString()}`}
                  description="This month's earnings"
                  icon={<DollarSign className="h-4 w-4" />}
                  trend={{ value: 15, isPositive: true }}
                />
                <MetricsCard
                  title="Expenses"
                  value={`$${metricsData.monthly.expenses.toLocaleString()}`}
                  description="This month's expenses"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={{ value: 8, isPositive: false }}
                />
                <MetricsCard
                  title="Tickets"
                  value={metricsData.monthly.tickets}
                  description="Tickets processed this month"
                  icon={<BarChart3 className="h-4 w-4" />}
                  trend={{ value: 20, isPositive: true }}
                />
                <MetricsCard
                  title="New Clients"
                  value={metricsData.monthly.newClients}
                  description="First-time clients this month"
                  icon={<UsersRound className="h-4 w-4" />}
                  trend={{ value: 12, isPositive: true }}
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
                <BarChart data={barChartData.data} />
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
                <PieChart data={pieChartData.data} />
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
                <LineChart data={lineChartData.data} />
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
                  {frequentClientsData.map((client, index) => (
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
                  ))}
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
