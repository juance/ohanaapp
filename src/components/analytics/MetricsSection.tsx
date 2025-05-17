
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { TicketAnalytics } from '@/lib/analytics/interfaces';
import ComparativeMetricsCard from './ComparativeMetricsCard';

interface MetricsSectionProps {
  loading: boolean;
  analytics: TicketAnalytics | null;
  previousAnalytics?: TicketAnalytics | null;
  periodLabel?: string;
}

const MetricsSection = ({ loading, analytics, previousAnalytics, periodLabel = 'Periodo seleccionado' }: MetricsSectionProps) => {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <ComparativeMetricsCard
        title="Total de Tickets"
        currentValue={analytics?.totalTickets || 0}
        previousValue={previousAnalytics?.totalTickets}
        icon={<ShoppingBag className="h-4 w-4" />}
        period={periodLabel}
      />
      <ComparativeMetricsCard
        title="Valor Promedio"
        currentValue={analytics?.averageTicketValue || 0}
        previousValue={previousAnalytics?.averageTicketValue}
        format="currency"
        icon={<DollarSign className="h-4 w-4" />}
        period={periodLabel}
      />
      <ComparativeMetricsCard
        title="Ingresos Totales"
        currentValue={analytics?.totalRevenue || 0}
        previousValue={previousAnalytics?.totalRevenue}
        format="currency"
        icon={<DollarSign className="h-4 w-4" />}
        period={periodLabel}
      />
      <ComparativeMetricsCard
        title="Tickets Listos"
        currentValue={analytics?.ticketsByStatus?.ready || 0}
        previousValue={previousAnalytics?.ticketsByStatus?.ready}
        icon={<CalendarIcon className="h-4 w-4" />}
        period={periodLabel}
      />
    </div>
  );
};

export default MetricsSection;
