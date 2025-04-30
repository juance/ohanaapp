
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, DollarSign, CalendarDays, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MetricsCardsProps {
  metrics: any;
  expenses: any;
  viewType: 'daily' | 'weekly' | 'monthly';
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function MetricsCards({ metrics, expenses, viewType, dateRange }: MetricsCardsProps) {
  // Usar directamente los datos de las estadísticas de tickets
  console.log('MetricsCards - metrics completo:', metrics);

  // Calcular métricas directamente desde los datos de tickets
  const revenue = Number(metrics?.revenue || 0);
  const currentExpenses = expenses ? expenses.total || 0 : 0;
  const profit = revenue - Number(currentExpenses || 0);
  const totalTickets = Number(metrics?.total || 0);
  const deliveredTickets = Number(metrics?.delivered || 0);
  const pendingTickets = Number(metrics?.pending || 0);
  const valetCount = Number(metrics?.valetCount || 0);
  const dryCleaningItemsCount = Number(metrics?.dryCleaningItemsCount || 0);

  // Formatear el rango de fechas para mostrar
  const dateRangeLabel = dateRange 
    ? `${format(dateRange.from, 'dd/MM/yyyy', { locale: es })} - ${format(dateRange.to, 'dd/MM/yyyy', { locale: es })}`
    : viewType === 'daily' ? 'Hoy' : viewType === 'weekly' ? 'Esta semana' : 'Este mes';

  console.log('MetricsCards - Valores calculados:', {
    revenue,
    totalTickets,
    deliveredTickets,
    pendingTickets,
    valetCount,
    dryCleaningItemsCount
  });

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
            {dateRangeLabel}
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
            {dateRangeLabel}
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
            {dateRangeLabel}
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
            {dateRangeLabel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets Entregados</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveredTickets}</div>
          <p className="text-xs text-muted-foreground">
            {dateRangeLabel}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets Pendientes</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTickets}</div>
          <p className="text-xs text-muted-foreground">
            {dateRangeLabel}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
