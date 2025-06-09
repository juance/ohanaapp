
import { subDays, format, startOfMonth, endOfMonth } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

export interface ProfitabilityMetrics {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  avgTicketValue: number;
  costPerTicket: number;
  profitPerTicket: number;
  breakdownByService: {
    valet: ProfitabilityBreakdown;
    drycleaning: ProfitabilityBreakdown;
    laundry: ProfitabilityBreakdown;
  };
  trends: {
    revenueGrowth: number;
    costGrowth: number;
    profitGrowth: number;
  };
}

export interface ProfitabilityBreakdown {
  revenue: number;
  estimatedCosts: number;
  profit: number;
  margin: number;
  volume: number;
}

export interface ProfitabilityAnalysis {
  current: ProfitabilityMetrics;
  previous: ProfitabilityMetrics;
  recommendations: string[];
  alerts: Array<{
    type: 'warning' | 'critical' | 'info';
    message: string;
    metric: string;
  }>;
}

export class ProfitabilityAnalysisService {
  private readonly serviceCosts = {
    valet: 150, // Costo estimado por valet
    drycleaning: 80, // Costo promedio por prenda
    laundry: 120 // Costo promedio por servicio de lavandería
  };

  async analyzeProfitability(period: 'week' | 'month' = 'month'): Promise<ProfitabilityAnalysis> {
    try {
      const current = await this.calculatePeriodMetrics(period, 0);
      const previous = await this.calculatePeriodMetrics(period, 1);
      
      const recommendations = this.generateRecommendations(current);
      const alerts = this.generateAlerts(current, previous);

      return {
        current,
        previous,
        recommendations,
        alerts
      };
    } catch (error) {
      console.error('Error analyzing profitability:', error);
      throw error;
    }
  }

  private async calculatePeriodMetrics(period: 'week' | 'month', periodsBack: number): Promise<ProfitabilityMetrics> {
    const days = period === 'week' ? 7 : 30;
    const startDate = subDays(new Date(), days * (periodsBack + 1));
    const endDate = subDays(new Date(), days * periodsBack);

    // Obtener tickets del período
    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select(`
        total,
        valet_quantity,
        dry_cleaning_items(quantity, price)
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('is_canceled', false);

    if (ticketsError) throw ticketsError;

    // Obtener gastos del período
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('amount')
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString());

    if (expensesError) throw expensesError;

    return this.calculateMetrics(tickets || [], expenses || []);
  }

  private calculateMetrics(tickets: any[], expenses: any[]): ProfitabilityMetrics {
    const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.total || 0), 0);
    const totalActualCosts = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    // Calcular costos estimados por servicio
    let valetRevenue = 0, valetCosts = 0, valetVolume = 0;
    let drycleaningRevenue = 0, drycleaningCosts = 0, drycleaningVolume = 0;
    let laundryRevenue = 0, laundryVolume = 0;

    tickets.forEach(ticket => {
      const valetQty = ticket.valet_quantity || 0;
      if (valetQty > 0) {
        valetVolume += valetQty;
        valetRevenue += valetQty * 800; // Precio promedio valet
        valetCosts += valetQty * this.serviceCosts.valet;
      }

      if (ticket.dry_cleaning_items && ticket.dry_cleaning_items.length > 0) {
        ticket.dry_cleaning_items.forEach((item: any) => {
          drycleaningVolume += item.quantity || 1;
          drycleaningRevenue += (item.quantity || 1) * (item.price || 300);
          drycleaningCosts += (item.quantity || 1) * this.serviceCosts.drycleaning;
        });
      }

      // Servicios que no son valet ni tintorería se consideran lavandería
      if (valetQty === 0 && (!ticket.dry_cleaning_items || ticket.dry_cleaning_items.length === 0)) {
        laundryVolume += 1;
        laundryRevenue += ticket.total || 0;
      }
    });

    const laundryRevenuePortion = totalRevenue - valetRevenue - drycleaningRevenue;
    const laundryCosts = laundryVolume * this.serviceCosts.laundry;

    const totalEstimatedCosts = valetCosts + drycleaningCosts + laundryCosts + totalActualCosts;
    const grossProfit = totalRevenue - totalEstimatedCosts;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCosts: totalEstimatedCosts,
      grossProfit,
      profitMargin,
      avgTicketValue: tickets.length > 0 ? totalRevenue / tickets.length : 0,
      costPerTicket: tickets.length > 0 ? totalEstimatedCosts / tickets.length : 0,
      profitPerTicket: tickets.length > 0 ? grossProfit / tickets.length : 0,
      breakdownByService: {
        valet: {
          revenue: valetRevenue,
          estimatedCosts: valetCosts,
          profit: valetRevenue - valetCosts,
          margin: valetRevenue > 0 ? ((valetRevenue - valetCosts) / valetRevenue) * 100 : 0,
          volume: valetVolume
        },
        drycleaning: {
          revenue: drycleaningRevenue,
          estimatedCosts: drycleaningCosts,
          profit: drycleaningRevenue - drycleaningCosts,
          margin: drycleaningRevenue > 0 ? ((drycleaningRevenue - drycleaningCosts) / drycleaningRevenue) * 100 : 0,
          volume: drycleaningVolume
        },
        laundry: {
          revenue: laundryRevenuePortion,
          estimatedCosts: laundryCosts,
          profit: laundryRevenuePortion - laundryCosts,
          margin: laundryRevenuePortion > 0 ? ((laundryRevenuePortion - laundryCosts) / laundryRevenuePortion) * 100 : 0,
          volume: laundryVolume
        }
      },
      trends: {
        revenueGrowth: 0,
        costGrowth: 0,
        profitGrowth: 0
      }
    };
  }

  private generateRecommendations(metrics: ProfitabilityMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.profitMargin < 20) {
      recommendations.push('Considerar optimizar costos operativos o ajustar precios');
    }

    if (metrics.breakdownByService.valet.margin < 15) {
      recommendations.push('Revisar precios del servicio de valet o optimizar costos');
    }

    if (metrics.breakdownByService.drycleaning.margin > 40) {
      recommendations.push('Considerar promocionar más el servicio de tintorería por su alta rentabilidad');
    }

    if (metrics.avgTicketValue < 500) {
      recommendations.push('Implementar estrategias de upselling para aumentar el ticket promedio');
    }

    return recommendations;
  }

  private generateAlerts(current: ProfitabilityMetrics, previous: ProfitabilityMetrics): Array<{
    type: 'warning' | 'critical' | 'info';
    message: string;
    metric: string;
  }> {
    const alerts = [];

    if (current.profitMargin < 10) {
      alerts.push({
        type: 'critical' as const,
        message: 'Margen de ganancia muy bajo',
        metric: 'profitMargin'
      });
    }

    if (current.profitMargin < previous.profitMargin - 5) {
      alerts.push({
        type: 'warning' as const,
        message: 'Disminución significativa en el margen de ganancia',
        metric: 'profitMargin'
      });
    }

    if (current.totalRevenue > previous.totalRevenue * 1.2) {
      alerts.push({
        type: 'info' as const,
        message: 'Crecimiento notable en ingresos',
        metric: 'totalRevenue'
      });
    }

    return alerts;
  }
}

export const profitabilityAnalysisService = new ProfitabilityAnalysisService();
