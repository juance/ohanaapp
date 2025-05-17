
import { useState, useEffect } from 'react';
import { fetchTicketAnalytics, exportAnalyticsToCSV } from '@/services/analytics.service';
import { TicketAnalytics, DateRange } from '@/lib/types/analytics.types';
import { toast } from '@/lib/toast';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<TicketAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTicketAnalytics(dateRange);
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido al cargar analíticas'));
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [dateRange]);

  const exportData = async () => {
    if (!analytics) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive"
      });
      return;
    }

    try {
      await exportAnalyticsToCSV(analytics);
      toast({
        title: "Éxito",
        description: "Datos exportados correctamente"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Error al exportar los datos",
        variant: "destructive"
      });
      console.error('Error exporting data:', err);
    }
  };

  return {
    isLoading,
    error,
    analytics,
    dateRange,
    setDateRange,
    exportData
  };
};
