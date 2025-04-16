
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, DollarSign, CalendarDays, TrendingUp, Award, CheckCircle } from 'lucide-react';

interface MetricsCardsProps {
  metrics: any;
  expenses: any;
  viewType: 'daily' | 'weekly' | 'monthly';
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function MetricsCards({ metrics, expenses, viewType }: MetricsCardsProps) {
  // Select metrics for current view
  const currentMetrics = metrics ? metrics[viewType] || {} : {};
  const currentExpenses = expenses ? expenses[viewType] || 0 : 0;

  console.log('MetricsCards - metrics:', metrics);
  console.log('MetricsCards - viewType:', viewType);
  console.log('MetricsCards - currentMetrics:', currentMetrics);

  // Calculate metrics safely
  const revenue = Number(currentMetrics?.totalRevenue || 0);
  const profit = revenue - Number(currentExpenses || 0);
  const totalTickets = Number(currentMetrics?.totalTickets || 0);
  const paidTickets = Number(currentMetrics?.paidTickets || 0);
  const freeValets = Number(currentMetrics?.freeValets || 0);

  console.log('MetricsCards - currentMetrics:', currentMetrics);
  console.log('MetricsCards - revenue:', revenue);
  console.log('MetricsCards - totalTickets:', totalTickets);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(revenue)}</div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ganancia</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profit < 0 ? 'text-red-500' : ''}`}>
            {formatCurrency(profit)}
          </div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTickets}</div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets Pagados</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{paidTickets}</div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valets Gratis</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{freeValets}</div>
          <p className="text-xs text-muted-foreground">
            {viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
