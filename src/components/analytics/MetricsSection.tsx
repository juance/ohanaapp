
import React from 'react';
import { CircleDollarSign, Package, CheckCircle2, ShoppingCart } from 'lucide-react';
import MetricsCard from '@/components/MetricsCard';
import { TicketAnalytics } from '@/lib/types/analytics.types';
import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

interface MetricsSectionProps {
  analytics: TicketAnalytics;
  loading: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ analytics, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <Loading />
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total de Tickets"
        value={analytics.totalTickets.toString()}
        icon={<ShoppingCart className="h-4 w-4" />}
        description="Total de tickets generados"
      />
      
      <MetricsCard
        title="Facturación Total"
        value={formatCurrency(analytics.totalRevenue)}
        icon={<CircleDollarSign className="h-4 w-4" />}
        description="Ingresos totales"
      />
      
      <MetricsCard
        title="Ticket Promedio"
        value={formatCurrency(analytics.averageTicketValue)}
        icon={<Package className="h-4 w-4" />}
        description="Valor promedio por ticket"
      />
      
      <MetricsCard
        title="Tickets Entregados"
        value={analytics.ticketsByStatus.delivered.toString()}
        icon={<CheckCircle2 className="h-4 w-4" />}
        description={`De un total de ${analytics.totalTickets} tickets`}
        trend={
          analytics.totalTickets > 0
            ? {
                value: Math.round((analytics.ticketsByStatus.delivered / analytics.totalTickets) * 100),
                isPositive: true
              }
            : undefined
        }
      />
    </div>
  );
};

export default MetricsSection;
