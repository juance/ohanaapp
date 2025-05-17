
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCard from '@/components/MetricsCard';
import { CalendarIcon, CoinsIcon, CheckCircle } from 'lucide-react';
import { TicketAnalytics } from '@/lib/analytics/interfaces';

interface MetricsSectionProps {
  loading: boolean;
  analytics: TicketAnalytics | null;
}

const MetricsSection = ({ loading, analytics }: MetricsSectionProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-20 w-full" />
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
    ticketsByStatus: { ready: 0 },
    itemTypeDistribution: {},
    paymentMethodDistribution: {},
    revenueByMonth: []
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Total de Tickets"
        value={safeAnalytics.totalTickets.toString() || '0'}
        icon={<CalendarIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Valor Promedio"
        value={`$${safeAnalytics.averageTicketValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Ingresos Totales"
        value={`$${safeAnalytics.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
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
