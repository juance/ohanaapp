
import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Hook for client data error handling
 */
export const useClientErrors = () => {
  const handleFetchError = useCallback((error: Error) => {
    console.error("Error fetching client data:", error);
    toast.error("Error al cargar los datos de clientes", {
      description: "Verifique su conexión e intente nuevamente"
    });
    return error;
  }, []);
  
  const handleLoyaltyDataError = useCallback(() => {
    console.error("Error fetching customer loyalty data");
    toast.warning("No se pudieron cargar los datos de lealtad de clientes", {
      description: "Intente nuevamente más tarde"
    });
  }, []);
  
  const handleRefreshSuccess = useCallback(() => {
    toast.success("Datos actualizados correctamente");
  }, []);
  
  return {
    handleFetchError,
    handleLoyaltyDataError,
    handleRefreshSuccess
  };
};
