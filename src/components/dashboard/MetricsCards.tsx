
import React from 'react';
import MetricsCard from '@/components/MetricsCard';
import { DollarSign, TrendingUp, BarChart3, UsersRound, BanknoteIcon } from 'lucide-react';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

interface MetricsCardsProps {
  viewType: 'daily' | 'weekly' | 'monthly';
  metrics: {
    daily: DailyMetrics | null;
    weekly: WeeklyMetrics | null;
    monthly: MonthlyMetrics | null;
  };
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ viewType, metrics, expenses }) => {
  // Helper to format currency
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  
  if (viewType === 'daily') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricsCard
          title="Ingresos Totales"
          value={formatCurrency(metrics.daily?.totalSales || 0)}
          description="Ganancias de hoy"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="Valets"
          value={metrics.daily?.valetCount || 0}
          description="Valets procesados hoy"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="Pagos en Efectivo"
          value={formatCurrency(metrics.daily?.paymentMethods.cash || 0)}
          description="Ingresos en efectivo de hoy"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricsCard
          title="Pagos Digitales"
          value={formatCurrency(
            (metrics.daily?.paymentMethods.debit || 0) + 
            (metrics.daily?.paymentMethods.mercadopago || 0) + 
            (metrics.daily?.paymentMethods.cuentaDni || 0)
          )}
          description="Ingresos digitales de hoy"
          icon={<UsersRound className="h-4 w-4" />}
          trend={{ value: 15, isPositive: true }}
        />
        <MetricsCard
          title="Gastos"
          value={formatCurrency(expenses.daily || 0)}
          description="Gastos de hoy"
          icon={<BanknoteIcon className="h-4 w-4" />}
          trend={{ value: 5, isPositive: false }}
        />
      </div>
    );
  }
  
  if (viewType === 'weekly') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricsCard
          title="Ingresos Totales"
          value={formatCurrency(
            Object.values(metrics.weekly?.salesByDay || {}).reduce((acc, val) => acc + val, 0)
          )}
          description="Ganancias de esta semana"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="Valets"
          value={
            Object.values(metrics.weekly?.valetsByDay || {}).reduce((acc, val) => acc + val, 0)
          }
          description="Valets procesados esta semana"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="Pagos en Efectivo"
          value={formatCurrency(metrics.weekly?.paymentMethods.cash || 0)}
          description="Ingresos en efectivo de esta semana"
          icon={<BarChart3 className="h-4 w-4" />}
          trend={{ value: 3, isPositive: true }}
        />
        <MetricsCard
          title="Pagos Digitales"
          value={formatCurrency(
            (metrics.weekly?.paymentMethods.debit || 0) + 
            (metrics.weekly?.paymentMethods.mercadopago || 0) + 
            (metrics.weekly?.paymentMethods.cuentaDni || 0)
          )}
          description="Ingresos digitales de esta semana"
          icon={<UsersRound className="h-4 w-4" />}
          trend={{ value: 10, isPositive: true }}
        />
        <MetricsCard
          title="Gastos"
          value={formatCurrency(expenses.weekly || 0)}
          description="Gastos de esta semana"
          icon={<BanknoteIcon className="h-4 w-4" />}
          trend={{ value: 7, isPositive: false }}
        />
      </div>
    );
  }
  
  // Monthly view
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricsCard
        title="Ingresos Totales"
        value={formatCurrency(
          Object.values(metrics.monthly?.salesByWeek || {}).reduce((acc, val) => acc + val, 0)
        )}
        description="Ganancias de este mes"
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: 15, isPositive: true }}
      />
      <MetricsCard
        title="Valets"
        value={
          Object.values(metrics.monthly?.valetsByWeek || {}).reduce((acc, val) => acc + val, 0)
        }
        description="Valets procesados este mes"
        icon={<TrendingUp className="h-4 w-4" />}
        trend={{ value: 20, isPositive: true }}
      />
      <MetricsCard
        title="Pagos en Efectivo"
        value={formatCurrency(metrics.monthly?.paymentMethods.cash || 0)}
        description="Ingresos en efectivo de este mes"
        icon={<BarChart3 className="h-4 w-4" />}
        trend={{ value: 18, isPositive: true }}
      />
      <MetricsCard
        title="Pagos Digitales"
        value={formatCurrency(
          (metrics.monthly?.paymentMethods.debit || 0) + 
          (metrics.monthly?.paymentMethods.mercadopago || 0) + 
          (metrics.monthly?.paymentMethods.cuentaDni || 0)
        )}
        description="Ingresos digitales de este mes"
        icon={<UsersRound className="h-4 w-4" />}
        trend={{ value: 25, isPositive: true }}
      />
      <MetricsCard
        title="Gastos"
        value={formatCurrency(expenses.monthly || 0)}
        description="Gastos de este mes"
        icon={<BanknoteIcon className="h-4 w-4" />}
        trend={{ value: 10, isPositive: false }}
      />
    </div>
  );
};

export default MetricsCards;
