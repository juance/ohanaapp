
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart as RechartsLineChart, Line } from 'recharts';
import { PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { ChartData, LineChartData, BarChartData } from '@/lib/types/analytics.types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#8dd1e1', '#a4de6c', '#d0ed57'];

interface BarChartProps {
  data: BarChartData[];
}

export const BarChart = ({ data }: BarChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No hay datos disponibles</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value}`, 'Total']}
          contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0' }} 
        />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

interface LineChartProps {
  data: LineChartData[];
}

export const LineChart = ({ data }: LineChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No hay datos disponibles</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Valor']}
          contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e2e8f0' }} 
        />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#3b82f6" activeDot={{ r: 8 }} name="Ingresos" />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Gastos" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

interface PieChartProps {
  data: ChartData[];
}

export const PieChart = ({ data }: PieChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No hay datos disponibles</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, 'Cantidad']} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
