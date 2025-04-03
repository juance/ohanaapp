
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ActionButtonsProps {
  onExport?: () => Promise<void>;
  isLoading?: boolean;
}

export const ActionButtons = ({ onExport, isLoading }: ActionButtonsProps) => {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    toast.toast("Actualizando datos...");
    
    try {
      // Invalidate ticket analytics query
      queryClient.invalidateQueries({
        queryKey: ['ticketAnalytics'],
      });
      
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Error", "Error al actualizar los datos");
    }
  };

  const handleExport = async () => {
    if (!onExport) {
      toast.toast("Función de exportación no disponible");
      return;
    }

    try {
      await onExport();
      // Toast is handled in the export function
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Error", "Error al exportar datos");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleRefresh}
        disabled={isLoading}
      >
        <RefreshCcw className="h-4 w-4" />
        <span>Actualizar</span>
      </Button>

      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleExport}
        disabled={isLoading || !onExport}
      >
        <Download className="h-4 w-4" />
        <span>Exportar CSV</span>
      </Button>
    </div>
  );
};
