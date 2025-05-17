
import { supabase } from '@/integrations/supabase/client';
import { TicketAnalytics, DateRange } from '@/lib/types/analytics.types';
import { format } from 'date-fns';

export const fetchTicketAnalytics = async (dateRange: DateRange): Promise<TicketAnalytics> => {
  try {
    // Call our database function to get analytics data
    const { data, error } = await supabase.rpc('calculate_ticket_metrics', {
      start_date: dateRange.from.toISOString(),
      end_date: dateRange.to.toISOString()
    });

    if (error) throw error;

    return data as TicketAnalytics;
  } catch (error) {
    console.error("Error fetching ticket analytics:", error);
    return {
      totalTickets: 0,
      totalRevenue: 0,
      averageTicketValue: 0,
      ticketsByStatus: { ready: 0, delivered: 0, pending: 0 },
      paymentMethodDistribution: {},
      itemTypeDistribution: {},
      revenueByMonth: []
    };
  }
};

export const exportAnalyticsToCSV = async (data: TicketAnalytics): Promise<void> => {
  try {
    // Convert analytics data to CSV format
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "Métricas de Tickets\n\n";
    
    // Add summary data
    csvContent += `Total de Tickets,${data.totalTickets}\n`;
    csvContent += `Ingresos Totales,${data.totalRevenue}\n`;
    csvContent += `Valor Promedio,${data.averageTicketValue}\n\n`;
    
    // Add ticket status
    csvContent += "Estado de Tickets\n";
    csvContent += `Listos,${data.ticketsByStatus.ready}\n`;
    csvContent += `Entregados,${data.ticketsByStatus.delivered}\n`;
    csvContent += `Pendientes,${data.ticketsByStatus.pending}\n\n`;
    
    // Add payment methods
    csvContent += "Métodos de Pago\n";
    Object.entries(data.paymentMethodDistribution).forEach(([method, count]) => {
      csvContent += `${method},${count}\n`;
    });
    csvContent += "\n";
    
    // Add item types
    csvContent += "Tipos de Artículos\n";
    Object.entries(data.itemTypeDistribution).forEach(([type, count]) => {
      csvContent += `${type},${count}\n`;
    });
    csvContent += "\n";
    
    // Add monthly revenue
    csvContent += "Ingresos Mensuales\n";
    csvContent += "Mes,Ingresos\n";
    data.revenueByMonth.forEach(({ month, revenue }) => {
      csvContent += `${month},${revenue}\n`;
    });
    
    // Create a download link and trigger it
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting analytics to CSV:", error);
    throw error;
  }
};
