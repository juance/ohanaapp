
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCard from '@/components/MetricsCard';
import { CalendarIcon, StarIcon, UsersIcon, CoinsIcon, CheckCircle } from 'lucide-react';

interface MetricsSectionProps {
  metrics: any;
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  if (!metrics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  // Ensure we have numbers for all metrics with proper defaults
  const totalTickets = metrics.totalTickets || 0;
  const avgTicketValue = metrics.averageTicketValue || 0;
  const totalRevenue = metrics.totalRevenue || 0;
  const readyTickets = metrics.ticketsByStatus?.ready || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Total de Tickets"
        value={totalTickets.toString()}
        icon={<CalendarIcon className="h-4 w-4" />}
        description="En el período seleccionado"
      />
      <MetricsCard
        title="Valor Promedio"
        value={`$${avgTicketValue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<CoinsIcon className="h-4 w-4" />}
        description="Por ticket"
      />
      <MetricsCard
        title="Ingresos Totales"
        value={`$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={<CoinsIcon className="h-4 w-4" />}
        description="En el período seleccionado"
      />
      <MetricsCard
        title="Tickets Listos"
        value={readyTickets.toString()}
        icon={<CheckCircle className="h-4 w-4" />}
        description="Listos para entregar"
      />
    </div>
  );
};

export default MetricsSection;
