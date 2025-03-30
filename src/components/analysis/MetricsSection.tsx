
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCard from '@/components/MetricsCard';
import { CalendarIcon, StarIcon, UsersIcon, CoinsIcon } from 'lucide-react';
import { TicketAnalytics } from '@/lib/analyticsService';

interface MetricsSectionProps {
  analytics: TicketAnalytics | null;
}

const MetricsSection = ({ analytics }: MetricsSectionProps) => {
  if (!analytics) {
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
        value={analytics.totalTickets.toString() || '0'}
        icon={<CalendarIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Valor Promedio"
        value={`$${analytics.averageTicketValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Ingresos Totales"
        value={`$${analytics.totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}`}
        icon={<CoinsIcon className="h-4 w-4" />}
      />
      <MetricsCard
        title="Tickets Listos"
        value={analytics.ticketsByStatus?.ready?.toString() || '0'}
        icon={<StarIcon className="h-4 w-4" />}
      />
    </div>
  );
};

export default MetricsSection;
