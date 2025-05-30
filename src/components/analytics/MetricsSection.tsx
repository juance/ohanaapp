
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, TrendingUp, Users } from 'lucide-react';
import { TicketAnalytics } from '@/lib/analytics/interfaces';

interface MetricsSectionProps {
  loading: boolean;
  analytics: TicketAnalytics;
  previousAnalytics?: TicketAnalytics | null;
  periodLabel?: string;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  loading, 
  analytics, 
  previousAnalytics,
  periodLabel = "Período actual"
}) => {
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const revenueChange = previousAnalytics ? 
    calculateChange(analytics.totalRevenue, previousAnalytics.totalRevenue) : 0;
  const ticketsChange = previousAnalytics ? 
    calculateChange(analytics.totalTickets, previousAnalytics.totalTickets) : 0;
  const avgValueChange = previousAnalytics ? 
    calculateChange(analytics.averageTicketValue, previousAnalytics.averageTicketValue) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
          {previousAnalytics && (
            <p className="text-xs text-muted-foreground">
              {formatChange(revenueChange)} respecto al período anterior
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalTickets}</div>
          {previousAnalytics && (
            <p className="text-xs text-muted-foreground">
              {formatChange(ticketsChange)} respecto al período anterior
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics.averageTicketValue.toFixed(0)}</div>
          {previousAnalytics && (
            <p className="text-xs text-muted-foreground">
              {formatChange(avgValueChange)} respecto al período anterior
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tickets Entregados</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.ticketsByStatus.delivered}</div>
          <p className="text-xs text-muted-foreground">
            {analytics.ticketsByStatus.pending} pendientes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsSection;
