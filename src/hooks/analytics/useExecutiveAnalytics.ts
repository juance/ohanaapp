
import { useState, useEffect } from 'react';
import { demandPredictionService, DemandAnalysis } from '@/lib/analytics/demandPrediction';
import { profitabilityAnalysisService, ProfitabilityAnalysis } from '@/lib/analytics/profitabilityAnalysis';
import { toast } from '@/lib/toast';

export interface ExecutiveAnalyticsData {
  demandAnalysis: DemandAnalysis | null;
  profitabilityAnalysis: ProfitabilityAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export const useExecutiveAnalytics = (period: 'week' | 'month' = 'month') => {
  const [data, setData] = useState<ExecutiveAnalyticsData>({
    demandAnalysis: null,
    profitabilityAnalysis: null,
    isLoading: true,
    error: null
  });

  const loadData = async () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Loading executive analytics data...');
      
      const [demandAnalysis, profitabilityAnalysis] = await Promise.all([
        demandPredictionService.predictDemand(7).catch(err => {
          console.error('Error loading demand analysis:', err);
          return null;
        }),
        profitabilityAnalysisService.analyzeProfitability(period).catch(err => {
          console.error('Error loading profitability analysis:', err);
          return null;
        })
      ]);

      console.log('Executive analytics loaded:', { demandAnalysis, profitabilityAnalysis });

      setData({
        demandAnalysis,
        profitabilityAnalysis,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error loading executive analytics:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      
      toast.error('Error al cargar análisis ejecutivo');
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const refreshData = () => {
    loadData();
  };

  // Calcular métricas de comparación
  const getGrowthMetrics = () => {
    if (!data.profitabilityAnalysis) return null;

    const { current, previous } = data.profitabilityAnalysis;

    return {
      revenueGrowth: previous.totalRevenue > 0 
        ? ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100 
        : 0,
      profitGrowth: previous.grossProfit > 0 
        ? ((current.grossProfit - previous.grossProfit) / previous.grossProfit) * 100 
        : 0,
      marginChange: current.profitMargin - previous.profitMargin,
      ticketValueGrowth: previous.avgTicketValue > 0 
        ? ((current.avgTicketValue - previous.avgTicketValue) / previous.avgTicketValue) * 100 
        : 0
    };
  };

  // Obtener alertas críticas
  const getCriticalAlerts = () => {
    if (!data.profitabilityAnalysis) return [];
    
    return data.profitabilityAnalysis.alerts.filter(alert => alert.type === 'critical');
  };

  // Obtener recomendaciones de alta prioridad
  const getHighPriorityRecommendations = () => {
    if (!data.profitabilityAnalysis) return [];
    
    return data.profitabilityAnalysis.recommendations.slice(0, 3);
  };

  // Obtener próximos días pico
  const getUpcomingPeakDays = () => {
    if (!data.demandAnalysis) return [];
    
    return data.demandAnalysis.peakDays;
  };

  return {
    ...data,
    refreshData,
    getGrowthMetrics,
    getCriticalAlerts,
    getHighPriorityRecommendations,
    getUpcomingPeakDays
  };
};
