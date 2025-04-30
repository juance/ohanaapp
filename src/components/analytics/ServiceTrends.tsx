
import React, { useState, useEffect } from 'react';
import { TrendChart } from './TrendChart';
import { Loading } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ServiceTrendsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const ServiceTrends: React.FC<ServiceTrendsProps> = ({ dateRange }) => {
  const [data, setData] = useState<{
    servicesByTypeData: any[];
    servicesByMonthData: any[];
    topServicesData: any[];
  }>({
    servicesByTypeData: [],
    servicesByMonthData: [],
    topServicesData: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener tickets con items dentro del rango de fechas
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('*, dry_cleaning_items(*)')
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
          
        if (ticketsError) throw ticketsError;
        
        // Contar servicios por tipo
        const serviceTypes: Record<string, number> = {
          'Valet': 0,
          'Tintorería': 0
        };
        
        // Contar servicios por mes
        const servicesByMonth: Record<string, { valet: number; drycleaning: number }> = {};
        
        // Contar servicios específicos
        const specificServiceCounts: Record<string, number> = {};
        
        tickets?.forEach(ticket => {
          // Contar tipos de servicio
          if (ticket.valet_quantity && ticket.valet_quantity > 0) {
            serviceTypes['Valet'] += ticket.valet_quantity;
          }
          
          if (ticket.dry_cleaning_items && ticket.dry_cleaning_items.length > 0) {
            serviceTypes['Tintorería'] += ticket.dry_cleaning_items.length;
            
            // Contar servicios específicos
            ticket.dry_cleaning_items.forEach((item: any) => {
              const serviceName = item.name;
              specificServiceCounts[serviceName] = (specificServiceCounts[serviceName] || 0) + (item.quantity || 1);
            });
          }
          
          // Agrupar por mes
          if (ticket.created_at) {
            const month = format(new Date(ticket.created_at), 'MMM yyyy', { locale: es });
            
            if (!servicesByMonth[month]) {
              servicesByMonth[month] = { valet: 0, drycleaning: 0 };
            }
            
            if (ticket.valet_quantity && ticket.valet_quantity > 0) {
              servicesByMonth[month].valet += ticket.valet_quantity;
            }
            
            if (ticket.dry_cleaning_items && ticket.dry_cleaning_items.length > 0) {
              servicesByMonth[month].drycleaning += ticket.dry_cleaning_items.length;
            }
          }
        });
        
        // Crear datos para gráficas
        const servicesByTypeData = Object.entries(serviceTypes).map(([name, value]) => ({
          name,
          value
        }));
        
        const servicesByMonthData = Object.entries(servicesByMonth).map(([month, counts]) => ({
          name: month,
          valet: counts.valet,
          tintoreria: counts.drycleaning
        }));
        
        // Obtener los 10 servicios más populares
        const topServicesData = Object.entries(specificServiceCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({
            name,
            cantidad: count
          }));
        
        setData({
          servicesByTypeData,
          servicesByMonthData,
          topServicesData
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching service trend data:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServiceData();
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
          data={data.servicesByTypeData} 
          title="Distribución de Servicios" 
          description="Proporción de tipos de servicios realizados"
          dataKey="value"
          type="pie"
          formatter={(value) => `${value} servicios`}
        />
        
        <TrendChart 
          data={data.topServicesData} 
          title="Servicios Más Populares" 
          description="Top 10 servicios más solicitados"
          dataKey="cantidad"
          type="bar"
          color="#8b5cf6"
          formatter={(value) => `${value} solicitudes`}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-1">
        <TrendChart 
          data={data.servicesByMonthData} 
          title="Evolución de Servicios por Mes" 
          description="Comparativa de tipos de servicios a lo largo del tiempo"
          dataKey="valet"
          type="line"
          formatter={(value) => `${value} servicios`}
          colors={['#3b82f6', '#10b981']}
        />
      </div>
    </div>
  );
};
