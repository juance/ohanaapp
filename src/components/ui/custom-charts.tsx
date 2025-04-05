
import React from 'react';
import { 
  ResponsiveContainer as RechartsResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

// Custom colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Export ResponsiveContainer from recharts for use in other components
export const ResponsiveContainer = RechartsResponsiveContainer;

// Bar Chart
export const BarChart = ({ data }: { data: { name: string; total: number }[] }) => {
  return (
    <RechartsResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#8884d8" />
      </RechartsBarChart>
    </RechartsResponsiveContainer>
  );
};

// Line Chart
export const LineChart = ({ data }: { data: { name: string; income: number; expenses: number }[] }) => {
  return (
    <RechartsResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
      </RechartsLineChart>
    </RechartsResponsiveContainer>
  );
};

// Pie Chart
export const PieChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <RechartsResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </RechartsResponsiveContainer>
  );
};
