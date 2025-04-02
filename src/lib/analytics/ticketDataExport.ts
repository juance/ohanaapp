
import { TicketAnalytics } from './ticketAnalyticsService';

/**
 * Exports ticket analytics data to CSV
 */
export const exportAnalyticsToCSV = async (data: TicketAnalytics): Promise<void> => {
  try {
    const csvContent = [
      ['Métrica', 'Valor'],
      ['Total de Tickets', data.totalTickets],
      ['Valor Promedio', data.averageTicketValue],
      ['Ingresos Totales', data.totalRevenue],
      ['Tickets Pendientes', data.ticketsByStatus?.pending || 0],
      ['Tickets en Proceso', data.ticketsByStatus?.processing || 0],
      ['Tickets Listos', data.ticketsByStatus?.ready || 0],
      ['Tickets Entregados', data.ticketsByStatus?.delivered || 0],
      [''],
      ['Distribución por Método de Pago'],
      ...Object.entries(data.paymentMethodDistribution).map(([method, count]) => [method, count]),
      [''],
      ['Distribución por Tipo de Artículo'],
      ...Object.entries(data.itemTypeDistribution).map(([type, count]) => [type, count]),
      [''],
      ['Ingresos por Mes'],
      ...data.revenueByMonth.map(({ month, revenue }) => [month, revenue])
    ];

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ticket_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};
