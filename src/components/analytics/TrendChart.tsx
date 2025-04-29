
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { InfoCircle } from 'lucide-react';

interface TrendChartProps {
  data: any[];
  title: string;
  description?: string;
  dataKey: string;
  xAxisKey?: string;
  type?: 'line' | 'area';
  color?: string;
  height?: number;
  formatter?: (value: number) => string;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  title,
  description,
  dataKey,
  xAxisKey = 'name',
  type = 'line',
  color = '#3b82f6',
  height = 300,
  formatter = (value) => `$${value.toLocaleString()}`
}) => {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <div className="text-center text-gray-500">
            <InfoCircle className="mx-auto h-10 w-10 mb-2 text-gray-400" />
            <p>No hay datos disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-xs font-medium text-gray-800">{`${label}`}</p>
          <p className="text-xs text-blue-600">{`${formatter(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                fillOpacity={1} 
                fill="url(#colorGradient)" 
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false} 
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
