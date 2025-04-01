
import { useState } from 'react';
import { ClientVisit } from '@/lib/types';
import { exportClientsToCSV } from '@/lib/exportUtils';
import { toast } from 'sonner';

/**
 * Hook for exporting client data
 */
export const useClientExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Export clients data to CSV
  const handleExportClients = async (clients: ClientVisit[]) => {
    try {
      setIsExporting(true);
      
      exportClientsToCSV(clients);
      
      toast.success("Datos exportados correctamente", {
        description: "El archivo CSV ha sido generado"
      });
    } catch (err) {
      console.error("Error exporting client data:", err);
      toast.error("Error al exportar datos", {
        description: "No se pudieron exportar los datos del cliente"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExportClients
  };
};
