
import { subDays, format, isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export interface DemandPrediction {
  date: string;
  predictedVolume: number;
  confidence: number;
  factors: {
    historical: number;
    seasonal: number;
    trend: number;
  };
}

export interface DemandAnalysis {
  predictions: DemandPrediction[];
  peakDays: string[];
  recommendedStaffing: Record<string, number>;
  inventoryRecommendations: Array<{
    item: string;
    recommended: number;
    current: number;
  }>;
}

export class DemandPredictionService {
  private async getHistoricalData(days: number = 90): Promise<any[]> {
    try {
      const startDate = subDays(new Date(), days);
      
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('created_at, total, valet_quantity, dry_cleaning_items(quantity)')
        .gte('created_at', startDate.toISOString())
        .eq('is_canceled', false);

      if (error) throw error;
      return tickets || [];
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }

  private analyzeSeasonality(data: any[]): Record<string, number> {
    const dayOfWeekVolumes: Record<string, number[]> = {};
    
    data.forEach(ticket => {
      const date = new Date(ticket.created_at);
      const dayOfWeek = format(date, 'EEEE');
      
      if (!dayOfWeekVolumes[dayOfWeek]) {
        dayOfWeekVolumes[dayOfWeek] = [];
      }
      
      const volume = (ticket.valet_quantity || 0) + 
                    (ticket.dry_cleaning_items?.reduce((sum: number, item: any) => 
                      sum + (item.quantity || 0), 0) || 0);
      
      dayOfWeekVolumes[dayOfWeek].push(volume);
    });

    const seasonalFactors: Record<string, number> = {};
    Object.entries(dayOfWeekVolumes).forEach(([day, volumes]) => {
      seasonalFactors[day] = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    });

    return seasonalFactors;
  }

  private calculateTrend(data: any[]): number {
    if (data.length < 14) return 1;

    const recentData = data.slice(-14);
    const olderData = data.slice(-28, -14);

    const recentAvg = recentData.length > 0 ? 
      recentData.reduce((sum, ticket) => {
        const volume = (ticket.valet_quantity || 0) + 
                      (ticket.dry_cleaning_items?.reduce((sum: number, item: any) => 
                        sum + (item.quantity || 0), 0) || 0);
        return sum + volume;
      }, 0) / recentData.length : 0;

    const olderAvg = olderData.length > 0 ?
      olderData.reduce((sum, ticket) => {
        const volume = (ticket.valet_quantity || 0) + 
                      (ticket.dry_cleaning_items?.reduce((sum: number, item: any) => 
                        sum + (item.quantity || 0), 0) || 0);
        return sum + volume;
      }, 0) / olderData.length : recentAvg;

    return olderAvg > 0 ? recentAvg / olderAvg : 1;
  }

  async predictDemand(days: number = 7): Promise<DemandAnalysis> {
    try {
      const historicalData = await this.getHistoricalData();
      const seasonalFactors = this.analyzeSeasonality(historicalData);
      const trendFactor = this.calculateTrend(historicalData);

      const predictions: DemandPrediction[] = [];
      const peakDays: string[] = [];

      for (let i = 0; i < days; i++) {
        const date = format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        const dayOfWeek = format(new Date(Date.now() + i * 24 * 60 * 60 * 1000), 'EEEE');
        
        const historicalAvg = seasonalFactors[dayOfWeek] || 10;
        const seasonal = seasonalFactors[dayOfWeek] || 10;
        const trend = trendFactor;
        
        const predictedVolume = Math.round(historicalAvg * trend);
        const confidence = Math.min(95, Math.max(60, 85 - (i * 5)));

        predictions.push({
          date,
          predictedVolume,
          confidence,
          factors: {
            historical: historicalAvg,
            seasonal,
            trend
          }
        });

        if (predictedVolume > historicalAvg * 1.3) {
          peakDays.push(date);
        }
      }

      const recommendedStaffing = this.calculateStaffingRecommendations(predictions);
      const inventoryRecommendations = await this.calculateInventoryRecommendations(predictions);

      return {
        predictions,
        peakDays,
        recommendedStaffing,
        inventoryRecommendations
      };
    } catch (error) {
      console.error('Error predicting demand:', error);
      return {
        predictions: [],
        peakDays: [],
        recommendedStaffing: {},
        inventoryRecommendations: []
      };
    }
  }

  private calculateStaffingRecommendations(predictions: DemandPrediction[]): Record<string, number> {
    const staffing: Record<string, number> = {};
    
    predictions.forEach(prediction => {
      const baseStaff = 2;
      const additionalStaff = Math.ceil(prediction.predictedVolume / 20);
      staffing[prediction.date] = Math.min(baseStaff + additionalStaff, 6);
    });

    return staffing;
  }

  private async calculateInventoryRecommendations(predictions: DemandPrediction[]) {
    try {
      const { data: inventory, error } = await supabase
        .from('inventory_items')
        .select('name, quantity, threshold');

      if (error) throw error;

      const totalPredictedVolume = predictions.reduce((sum, p) => sum + p.predictedVolume, 0);
      
      return (inventory || []).map(item => ({
        item: item.name,
        recommended: Math.max(item.threshold || 5, Math.ceil(totalPredictedVolume * 0.1)),
        current: item.quantity || 0
      }));
    } catch (error) {
      console.error('Error calculating inventory recommendations:', error);
      return [];
    }
  }
}

export const demandPredictionService = new DemandPredictionService();
