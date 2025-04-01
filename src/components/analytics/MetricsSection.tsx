
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCard from '@/components/MetricsCard';
import { CalendarIcon, StarIcon, UsersIcon, CoinsIcon } from 'lucide-react';

interface MetricsSectionProps {
  metrics: any;
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  if (!metrics) {
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
      <MetricsCard
        title="Total de Tickets"
        value={metrics.totalTickets?.toString() || '0'}
        icon={<CalendarIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Valor Promedio"
        value={`$${metrics.averageTicketValue?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Ingresos Totales"
        value={`$${metrics.totalRevenue?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Tickets Listos"
        value={metrics.ticketsByStatus?.ready?.toString() || '0'}
        icon={<StarIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default MetricsSection;
