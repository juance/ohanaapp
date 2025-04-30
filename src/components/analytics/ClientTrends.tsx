
import React, { useState, useEffect } from 'react';
import { TrendChart } from './TrendChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientTrendsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const ClientTrends: React.FC<ClientTrendsProps> = ({ dateRange }) => {
  const [data, setData] = useState<{
    newClientsData: any[];
    activeClientsData: any[];
    frequencyData: any[];
  }>({
    newClientsData: [],
    activeClientsData: [],
    frequencyData: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Get all customers
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*');
          
        if (customersError) throw customersError;
        
        // Group customers by creation date (month)
        const newClientsByMonth: Record<string, number> = {};
        const activeClientsByMonth: Record<string, number> = {};
        
        // Get the last 12 months
        const months = [];
        for (let i = 0; i < 12; i++) {
          const date = subMonths(new Date(), i);
          const monthKey = format(date, 'yyyy-MM');
          const monthLabel = format(date, 'MMM yyyy', { locale: es });
          
          months.unshift({ key: monthKey, label: monthLabel });
          
          newClientsByMonth[monthLabel] = 0;
          activeClientsByMonth[monthLabel] = 0;
        }
        
        // Count new customers per month
        customers?.forEach(customer => {
          if (customer.created_at) {
            const creationDate = new Date(customer.created_at);
            const monthKey = format(creationDate, 'MMM yyyy', { locale: es });
            
            if (newClientsByMonth[monthKey] !== undefined) {
              newClientsByMonth[monthKey]++;
            }
          }
          
          if (customer.last_visit) {
            const lastVisitDate = new Date(customer.last_visit);
            const monthKey = format(lastVisitDate, 'MMM yyyy', { locale: es });
            
            if (activeClientsByMonth[monthKey] !== undefined) {
              activeClientsByMonth[monthKey]++;
            }
          }
        });
        
        // Create data arrays for charts
        const newClientsData = months.map(month => ({
          name: month.label,
          cantidad: newClientsByMonth[month.label] || 0
        }));
        
        const activeClientsData = months.map(month => ({
          name: month.label,
          cantidad: activeClientsByMonth[month.label] || 0
        }));
        
        // Count customers by frequency
        const frequencyCounts: Record<string, number> = {
          'Semanal': 0,
          'Mensual': 0,
          'Trimestral': 0,
          'Ocasional': 0
        };
        
        customers?.forEach(customer => {
          if (customer.last_visit) {
            const lastVisitDate = new Date(customer.last_visit);
            const now = new Date();
            const diffDays = Math.floor((now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 7) frequencyCounts['Semanal']++;
            else if (diffDays <= 30) frequencyCounts['Mensual']++;
            else if (diffDays <= 90) frequencyCounts['Trimestral']++;
            else frequencyCounts['Ocasional']++;
          } else {
            frequencyCounts['Ocasional']++;
          }
        });
        
        const frequencyData = Object.entries(frequencyCounts).map(([name, value]) => ({
          name,
          value
        }));
        
        setData({
          newClientsData,
          activeClientsData,
          frequencyData
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching client trend data:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [dateRange]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <TrendChart 
          data={data.newClientsData} 
          title="Nuevos Clientes por Mes" 
          description="Evolución de nuevos clientes registrados"
          dataKey="cantidad"
          type="bar"
          color="#10b981"
          formatter={(value) => `${value} clientes`}
        />
        
        <TrendChart 
          data={data.activeClientsData} 
          title="Clientes Activos por Mes" 
          description="Clientes con órdenes en el mes"
          dataKey="cantidad"
          type="line"
          formatter={(value) => `${value} clientes`}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Frecuencia</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <TrendChart 
              data={data.frequencyData} 
              title=""
              dataKey="value"
              type="pie"
              formatter={(value) => `${value} clientes`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
