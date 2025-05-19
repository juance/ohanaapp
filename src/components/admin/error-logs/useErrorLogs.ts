
import { useState, useEffect, useCallback } from 'react';
import { getErrors, clearErrors, resolveError, deleteError, clearResolvedErrors } from '@/lib/errorService';
import { toast } from "@/lib/toast";
import { SystemError } from '@/lib/types/error.types';

export const useErrorLogs = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isClearing, setIsClearing] = useState(false);
  const [isClearingResolved, setIsClearingResolved] = useState(false);

  const loadErrors = useCallback(async () => {
    setIsLoading(true);
    try {
      const systemErrors = await getErrors();
      setErrors(systemErrors);
    } catch (error) {
      console.error("Error loading error logs:", error);
      toast.error("No se pudieron cargar los registros de errores.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  const handleClearErrors = async () => {
    setIsClearing(true);
    try {
      await clearErrors();
      setErrors([]);
      toast.success("Los registros de errores han sido limpiados exitosamente.");
    } catch (error) {
      console.error("Error clearing error logs:", error);
      toast.error("No se pudieron limpiar los registros de errores.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearResolvedErrors = async () => {
    setIsClearingResolved(true);
    try {
      await clearResolvedErrors();
      loadErrors(); // Recargar errores
      toast.success("Se han eliminado los registros de errores resueltos.");
    } catch (error) {
      console.error("Error clearing resolved error logs:", error);
      toast.error("No se pudieron limpiar los registros de errores resueltos.");
    } finally {
      setIsClearingResolved(false);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      await resolveError(errorId);
      // Actualizar el estado local
      setErrors(errors.map(error =>
        error.id === errorId ? { ...error, resolved: true } : error
      ));
      toast.success("El error ha sido marcado como resuelto.");
    } catch (error) {
      console.error("Error resolving error log:", error);
      toast.error("No se pudo marcar el error como resuelto.");
    }
  };

  const handleDeleteError = async (errorId: string) => {
    try {
      await deleteError(errorId);
      // Actualizar el estado local
      setErrors(errors.filter(error => error.id !== errorId));
      toast.success("El error ha sido eliminado correctamente.");
    } catch (error) {
      console.error("Error deleting error log:", error);
      toast.error("No se pudo eliminar el error.");
    }
  };

  return {
    errors,
    isLoading,
    activeTab,
    isClearing,
    isClearingResolved,
    setActiveTab,
    loadErrors,
    handleClearErrors,
    handleClearResolvedErrors,
    handleResolveError,
    handleDeleteError,
  };
};
