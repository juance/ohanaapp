
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/custom-charts';
import { Calendar } from 'lucide-react';
import { ClientVisit } from '@/lib/types';

interface ChartSectionProps {
  viewType: 'daily' | 'weekly' | 'monthly';
  chartData: {
    barData: { name: string; total: number }[];
    lineData: { name: string; income: number; expenses: number }[];
    pieData: { name: string; value: number }[];
  };
  frequentClients: ClientVisit[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ 
  viewType = 'monthly', 
  chartData = { 
    barData: [], 
    lineData: [], 
    pieData: [] 
  }, 
  frequentClients = [] 
}) => {
  // Ensure all data properties exist with default empty arrays if undefined
  const safeBarData = chartData?.barData || [];
  const safeLineData = chartData?.lineData || [];
  const safePieData = chartData?.pieData?.length ? chartData.pieData : [{ name: 'Sin Datos', value: 1 }];
  const safeClients = frequentClients || [];

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Resumen de Ingresos</CardTitle>
          <CardDescription>
            {viewType === 'daily' && 'Ingresos de hoy por hora'}
            {viewType === 'weekly' && 'Ingresos diarios de esta semana'}
            {viewType === 'monthly' && 'Ingresos semanales de este mes'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart data={safeBarData} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Distribución de Servicios</CardTitle>
          <CardDescription>
            Desglose de servicios solicitados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PieChart data={safePieData} />
        </CardContent>
      </Card>
      
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Ingresos vs Gastos</CardTitle>
          <CardDescription>
            Comparación de ingresos y gastos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={safeLineData} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Clientes Frecuentes</CardTitle>
          <CardDescription>
            Clientes con más visitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeClients.length > 0 ? (
              safeClients.slice(0, 5).map((client, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <div className="font-medium">{client.clientName}</div>
                    <div className="text-xs text-muted-foreground">{client.phoneNumber}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{client.visitCount} visitas</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No hay datos de visitas de clientes disponibles
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
