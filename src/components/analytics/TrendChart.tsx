
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
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface TrendChartProps {
  data: any[];
  title: string;
  description?: string;
  dataKey: string;
  xAxisKey?: string;
  type?: 'line' | 'area' | 'bar' | 'pie';
  color?: string;
  height?: number;
  formatter?: (value: number) => string;
  colors?: string[];
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
  formatter = (value) => `$${value.toLocaleString()}`,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
}) => {
  // Si no hay data, mostrar un mensaje
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex items-center justify-center h-52">
          <div className="text-center text-gray-500">
            <Info className="mx-auto h-10 w-10 mb-2 text-gray-400" />
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

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
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
        );
        
      case 'bar':
        return (
          <BarChart data={data}>
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
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
        
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={xAxisKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={formatter} />
          </PieChart>
        );
        
      case 'line':
      default:
        return (
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
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
