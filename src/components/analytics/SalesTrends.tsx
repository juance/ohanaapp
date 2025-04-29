
import React, { useState, useEffect } from 'react';
import { TrendChart } from './TrendChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { cacheService } from '@/lib/cacheService';
import { format, subDays, subMonths, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';

interface SalesTrendsProps {
  defaultTimeRange?: 'week' | 'month' | 'quarter' | 'year';
}

export const SalesTrends: React.FC<SalesTrendsProps> = ({ defaultTimeRange = 'month' }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>(defaultTimeRange);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        
        // Define date range based on selected time range
        let startDate: Date;
        let dateFormat: string;
        let groupBy: 'day' | 'week' | 'month';
        
        switch (timeRange) {
          case 'week':
            startDate = subWeeks(new Date(), 1);
            dateFormat = 'EEE';
            groupBy = 'day';
            break;
          case 'month':
            startDate = subMonths(new Date(), 1);
            dateFormat = 'dd MMM';
            groupBy = 'day';
            break;
          case 'quarter':
            startDate = subMonths(new Date(), 3);
            dateFormat = 'MMM';
            groupBy = 'month';
            break;
          case 'year':
            startDate = subMonths(new Date(), 12);
            dateFormat = 'MMM';
            groupBy = 'month';
            break;
        }
        
        // Create cache key based on time range
        const cacheKey = `sales-trend-${timeRange}`;
        
        // Define fetch function
        const fetchFunction = async () => {
          // Get tickets within date range
          const { data, error } = await supabase
            .from('tickets')
            .select('id, created_at, total')
            .gte('created_at', startDate.toISOString())
            .order('created_at');
          
          if (error) throw error;
          
          // Process data for charts - group by day/week/month
          const groupedData: { [key: string]: { date: string; total: number } } = {};
          
          data.forEach(ticket => {
            const date = new Date(ticket.created_at);
            let key: string;
            
            // Group by appropriate time unit
            switch (groupBy) {
              case 'day':
                key = format(date, 'yyyy-MM-dd');
                break;
              case 'week':
                // Get the week number
                const weekNumber = Math.ceil(date.getDate() / 7);
                key = `${format(date, 'yyyy-MM')}-W${weekNumber}`;
                break;
              case 'month':
                key = format(date, 'yyyy-MM');
                break;
            }
            
            // Update or initialize group
            if (!groupedData[key]) {
              groupedData[key] = { 
                date: format(date, dateFormat, { locale: es }), 
                total: 0 
              };
            }
            
            groupedData[key].total += ticket.total || 0;
          });
          
          // Convert to array sorted by date
          return Object.entries(groupedData)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([_, value]) => ({
              name: value.date,
              revenue: Math.round(value.total)
            }));
        };
        
        // Use cache or fetch data
        const data = await cacheService.getOrFetch(
          cacheKey,
          fetchFunction,
          { namespace: 'analytics', ttl: 30 * 60 * 1000 } // 30 minutes TTL
        );
        
        setSalesData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sales trend data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
  }, [timeRange]);

  return (
    <div className="space-y-4">
      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
        <TabsList>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
          <TabsTrigger value="quarter">Trimestre</TabsTrigger>
          <TabsTrigger value="year">Año</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <Loading />
        </div>
      ) : error ? (
        <ErrorMessage 
          message={error.message} 
          title="Error al cargar datos de ventas" 
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <TrendChart 
            data={salesData} 
            title="Tendencia de Ventas" 
            description={`Evolución de ventas (último ${
              timeRange === 'week' ? 'semana' : 
              timeRange === 'month' ? 'mes' : 
              timeRange === 'quarter' ? 'trimestre' : 'año'
            })`}
            dataKey="revenue"
            type="line"
          />
          
          <TrendChart 
            data={salesData} 
            title="Ingresos Acumulados" 
            description="Vista de ingresos por periodo"
            dataKey="revenue"
            type="area"
            color="#10b981"
          />
        </div>
      )}
    </div>
  );
};
