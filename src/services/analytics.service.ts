
import { supabase } from "@/integrations/supabase/client";
import { TicketAnalytics, DateRange } from "@/lib/types/analytics.types";
import { toast } from "@/lib/toast";

/**
 * Fetch ticket analytics data from the database
 */
export const fetchTicketAnalytics = async (dateRange: DateRange): Promise<TicketAnalytics> => {
  try {
    const { data, error } = await supabase.rpc(
      'calculate_ticket_metrics',
      {
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      }
    );

    if (error) throw error;
    
    // Type cast as unknown first since the shape needs to be validated
    const typedData = data as unknown as TicketAnalytics;
    
    return typedData;
  } catch (error) {
    console.error("Error fetching ticket analytics:", error);
    toast.error("Error fetching analytics data");
    // Return default data
    return {
      totalTickets: 0,
      totalRevenue: 0,
      averageTicketValue: 0,
      ticketsByStatus: {
        ready: 0,
        delivered: 0,
        pending: 0
      },
      paymentMethodDistribution: {},
      itemTypeDistribution: {},
      revenueByMonth: []
    };
  }
};

/**
 * Export analytics data to CSV
 */
export const exportAnalyticsToCSV = async (analytics: TicketAnalytics): Promise<void> => {
  try {
    // Create CSV content
    const csvContent = [
      // Headers
      ["Category", "Value"],
      ["Total Tickets", analytics.totalTickets.toString()],
      ["Total Revenue", `$${analytics.totalRevenue.toFixed(2)}`],
      ["Average Ticket Value", `$${analytics.averageTicketValue.toFixed(2)}`],
      ["Ready Tickets", analytics.ticketsByStatus.ready.toString()],
      ["Delivered Tickets", analytics.ticketsByStatus.delivered.toString()],
      ["Pending Tickets", analytics.ticketsByStatus.pending.toString()],
      [""], // Empty row for separation
      ["Payment Method", "Count"],
      ...Object.entries(analytics.paymentMethodDistribution).map(([method, count]) => [method, count.toString()]),
      [""], // Empty row for separation
      ["Item Type", "Count"],
      ...Object.entries(analytics.itemTypeDistribution).map(([type, count]) => [type, count.toString()]),
      [""], // Empty row for separation
      ["Month", "Revenue"],
      ...analytics.revenueByMonth.map(item => [item.month, `$${item.revenue.toFixed(2)}`])
    ];

    // Convert to CSV string
    const csv = csvContent.map(row => row.join(',')).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting data:", error);
    toast.error("Failed to export data");
    throw error;
  }
};
