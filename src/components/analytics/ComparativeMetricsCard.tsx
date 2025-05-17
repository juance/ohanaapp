
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface ComparativeMetricsCardProps {
  title: string;
  currentValue: number | string;
  previousValue?: number | string;
  icon?: React.ReactNode;
  format?: 'currency' | 'number' | 'percent';
  period?: string;
}

const ComparativeMetricsCard = ({
  title,
  currentValue,
  previousValue,
  icon,
  format = 'number',
  period = 'Hoy'
}: ComparativeMetricsCardProps) => {
  
  // Format the value based on the specified format
  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString('es-AR', { 
          minimumFractionDigits: 0, 
          maximumFractionDigits: 0 
        })}`;
      case 'percent':
        return `${value.toLocaleString('es-AR', { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 1 
        })}%`;
      default:
        return value.toLocaleString('es-AR');
    }
  };
  
  // Calculate percentage change
  const calculateChange = () => {
    if (!previousValue || typeof previousValue !== 'number' || typeof currentValue !== 'number') return null;
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    
    return ((currentValue - previousValue) / previousValue) * 100;
  };
  
  const percentChange = calculateChange();
  const isPositive = percentChange !== null && percentChange >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(currentValue)}</div>
        <div className="mt-1 flex items-center text-xs">
          <span className="text-muted-foreground">{period}</span>
          
          {percentChange !== null && (
            <div className={`ml-2 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
              {Math.abs(percentChange).toFixed(1)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparativeMetricsCard;
