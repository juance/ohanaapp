
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCard from '@/components/MetricsCard';
import { ShoppingBag, DollarSign, BarChart4, CheckCircle } from 'lucide-react';
import { TicketAnalytics } from '@/lib/types/analytics.types';

interface MetricsSectionProps {
  loading: boolean;
  analytics: TicketAnalytics | null;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ loading, analytics }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Ensure analytics object exists with default values
  const safeAnalytics = analytics || {
    totalTickets: 0,
    averageTicketValue: 0,
    totalRevenue: 0,
    ticketsByStatus: { ready: 0, delivered: 0, pending: 0 },
    itemTypeDistribution: {},
    paymentMethodDistribution: {},
    revenueByMonth: []
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Total de Tickets"
        value={safeAnalytics.totalTickets.toString() || '0'}
        icon={<ShoppingBag className="h-4 w-4" />}
      />
      <MetricsCard
        title="Valor Promedio"
        value={`$${safeAnalytics.averageTicketValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<BarChart4 className="h-4 w-4" />}
      />
      <MetricsCard
        title="Ingresos Totales"
        value={`$${safeAnalytics.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricsCard
        title="Tickets Listos"
        value={safeAnalytics.ticketsByStatus?.ready?.toString() || '0'}
        icon={<CheckCircle className="h-4 w-4" />}
      />
    </div>
  );
};

export default MetricsSection;
