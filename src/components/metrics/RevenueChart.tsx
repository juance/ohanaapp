
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: any;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = data?.revenueByDate || [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ingresos por Día</CardTitle>
        <CardDescription>
          Ingresos generados en el período seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Ingresos']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Ingresos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay datos disponibles para mostrar</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
