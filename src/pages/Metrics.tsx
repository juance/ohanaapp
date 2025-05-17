
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import MetricsCard from '@/components/MetricsCard';
import { BarChart4, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

const Metrics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Métricas</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Ventas Totales"
          value="$435,200"
          description="Últimos 30 días"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend="+12.5%"
          trendDirection="up"
        />
        <MetricsCard
          title="Tickets Emitidos"
          value="235"
          description="Últimos 30 días"
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          trend="+8.2%"
          trendDirection="up"
        />
        <MetricsCard
          title="Ticket Promedio"
          value="$1,852"
          description="Últimos 30 días"
          icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
          trend="+3.7%"
          trendDirection="up"
        />
        <MetricsCard
          title="Clientes Nuevos"
          value="34"
          description="Últimos 30 días"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend="+5.3%"
          trendDirection="up"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-muted-foreground">Gráfico de métricas mensuales</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Servicios Más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-muted-foreground">Gráfico de servicios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-muted-foreground">Gráfico de métodos de pago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
