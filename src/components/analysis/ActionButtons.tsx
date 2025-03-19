
import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TicketAnalytics } from '@/lib/analyticsService';
import { format } from 'date-fns';

interface ActionButtonsProps {
  loading: boolean;
  analytics: TicketAnalytics | null;
  onRefresh: () => void;
}

const ActionButtons = ({ loading, analytics, onRefresh }: ActionButtonsProps) => {
  const handleDownloadCSV = () => {
    if (!analytics) return;
    
    // Generate CSV content
    const csvContent = [
      // Headers
      ['Fecha', 'Total Tickets', 'Ingreso Promedio', 'Ingreso Total'].join(','),
      // Data
      [
        format(new Date(), 'dd/MM/yyyy'),
        analytics.totalTickets,
        analytics.averageTicketValue.toFixed(2),
        analytics.totalRevenue.toFixed(2)
      ].join(',')
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analisis_tickets_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Reporte CSV descargado');
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Actualizar
      </Button>
      
      <Button variant="outline" onClick={handleDownloadCSV} disabled={loading}>
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
};

export default ActionButtons;
