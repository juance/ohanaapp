
import { useMemo } from 'react';
import { DailyMetrics, WeeklyMetrics, MonthlyMetrics } from '@/lib/types';

type MetricsPeriod = 'daily' | 'weekly' | 'monthly';

interface ChartDataResult {
  barData: { name: string; total: number }[];
  lineData: { name: string; income: number; expenses: number }[];
  pieData: { name: string; value: number }[];
}

export const useChartData = (
  period: MetricsPeriod,
  metrics: {
    daily: DailyMetrics | null;
    weekly: WeeklyMetrics | null;
    monthly: MonthlyMetrics | null;
  },
  expenses: {
    daily: number;
    weekly: number;
    monthly: number;
  }
): ChartDataResult => {
  
  const barData = useMemo(() => {
    if (period === 'daily') {
      // For daily, we may not have hourly data from the database
      // So we'll use mock data or empty data
      return [
        { name: '8am', total: 0 },
        { name: '10am', total: 0 },
        { name: '12pm', total: 0 },
        { name: '2pm', total: 0 },
        { name: '4pm', total: 0 },
        { name: '6pm', total: 0 },
      ];
    } else if (period === 'weekly' && metrics.weekly) {
      // Convert weekly data to chart format
      return Object.entries(metrics.weekly.salesByDay || {}).map(([day, total]) => ({
        name: day.substring(0, 3),  // Abbreviate day names
        total: Number(total) || 0   // Ensure total is a number
      }));
    } else if (period === 'monthly' && metrics.monthly) {
      // Convert monthly data to chart format
      return Object.entries(metrics.monthly.salesByWeek || {}).map(([week, total]) => ({
        name: week,
        total: Number(total) || 0   // Ensure total is a number
      }));
    }
    
    // Default fallback data if no matching period data
    return [
      { name: 'No Data', total: 0 }
    ];
  }, [period, metrics]);
  
  const lineData = useMemo(() => {
    if (period === 'weekly' && metrics.weekly) {
      // Now include actual expenses data
      return Object.entries(metrics.weekly.salesByDay || {}).map(([day, income]) => {
        // Since we don't have daily breakdown of expenses, we'll distribute weekly expenses evenly
        const dailyExpenseEstimate = expenses.weekly / 7;
        
        return {
          name: day.substring(0, 3),
          income: Number(income) || 0,  // Ensure income is a number
          expenses: dailyExpenseEstimate
        };
      });
    } else if (period === 'monthly' && metrics.monthly) {
      return Object.entries(metrics.monthly.salesByWeek || {}).map(([week, income]) => {
        // Distribute monthly expenses across weeks
        const weeklyExpenseEstimate = expenses.monthly / 4;
        
        return {
          name: week,
          income: Number(income) || 0,  // Ensure income is a number
          expenses: weeklyExpenseEstimate
        };
      });
    }
    
    // Default data
    return [
      { name: 'Week 1', income: 0, expenses: expenses.monthly / 4 || 0 },
      { name: 'Week 2', income: 0, expenses: expenses.monthly / 4 || 0 },
      { name: 'Week 3', income: 0, expenses: expenses.monthly / 4 || 0 },
      { name: 'Week 4', income: 0, expenses: expenses.monthly / 4 || 0 },
    ];
  }, [period, metrics, expenses]);
  
  const pieData = useMemo(() => {
    let dryCleaningItems: Record<string, number> = {};
    
    if (period === 'daily' && metrics.daily) {
      dryCleaningItems = metrics.daily.dryCleaningItems || {};
    } else if (period === 'weekly' && metrics.weekly) {
      dryCleaningItems = metrics.weekly.dryCleaningItems || {};
    } else if (period === 'monthly' && metrics.monthly) {
      dryCleaningItems = metrics.monthly.dryCleaningItems || {};
    }
    
    // Convert to chart format
    const chartData = Object.entries(dryCleaningItems).map(([name, value]) => ({
      name,
      value: Number(value) || 0  // Ensure value is a number
    }));
    
    // Return default data if empty
    return chartData.length ? chartData : [{ name: 'No Data', value: 1 }];
  }, [period, metrics]);
  
  return {
    barData,
    lineData,
    pieData
  };
};
