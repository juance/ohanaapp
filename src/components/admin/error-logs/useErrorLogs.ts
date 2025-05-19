
import { useState, useCallback } from 'react';
import { getErrors, resolveError, deleteError, clearErrors, clearResolvedErrors } from '@/lib/errorService';
import { SystemError, ErrorLevel } from '@/lib/types/error.types';
import { toast } from '@/lib/toast';

export const useErrorLogs = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [isClearingResolved, setIsClearingResolved] = useState<boolean>(false);

  const loadErrors = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedErrors = await getErrors();
      // Convert to the proper SystemError type from error.types.ts and handle enum differences
      const typedErrors: SystemError[] = fetchedErrors.map(error => ({
        ...error,
        // Map the error level values from errorService.ts to error.types.ts
        level: mapErrorLevel(error.level),
      }));
      setErrors(typedErrors);
    } catch (error) {
      console.error('Error fetching errors:', error);
      toast.error('Error al cargar los registros de errores');
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to map between different ErrorLevel enum formats
  const mapErrorLevel = (level: any): ErrorLevel | undefined => {
    if (!level) return undefined;
    
    // Convert from errorService.ErrorLevel to error.types.ErrorLevel
    switch(level) {
      case 'INFO': return ErrorLevel.INFO;
      case 'WARNING': return ErrorLevel.WARNING_LEGACY;
      case 'ERROR': 
      case 'error': return ErrorLevel.ERROR;
      case 'CRITICAL': 
      case 'critical': return ErrorLevel.CRITICAL;
      default: return undefined; // Fallback
    }
  };

  const handleResolveError = useCallback(async (errorId: string) => {
    try {
      await resolveError(errorId);
      // Update local state
      setErrors(prevErrors =>
        prevErrors.map(error =>
          error.id === errorId ? { ...error, resolved: true } : error
        )
      );
      toast.success('Error marcado como resuelto');
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast.error('Error al marcar como resuelto');
    }
  }, []);

  const handleDeleteError = useCallback(async (errorId: string) => {
    try {
      await deleteError(errorId);
      // Remove from local state
      setErrors(prevErrors => prevErrors.filter(error => error.id !== errorId));
      toast.success('Error eliminado correctamente');
    } catch (error) {
      console.error('Error deleting error:', error);
      toast.error('Error al eliminar el registro');
    }
  }, []);

  const handleClearErrors = useCallback(async () => {
    setIsClearing(true);
    try {
      await clearErrors();
      setErrors([]);
      toast.success('Todos los errores han sido eliminados');
    } catch (error) {
      console.error('Error clearing errors:', error);
      toast.error('Error al limpiar los registros');
    } finally {
      setIsClearing(false);
    }
  }, []);

  const handleClearResolvedErrors = useCallback(async () => {
    setIsClearingResolved(true);
    try {
      await clearResolvedErrors();
      // Remove resolved errors from state
      setErrors(prevErrors => prevErrors.filter(error => !error.resolved));
      toast.success('Errores resueltos eliminados correctamente');
    } catch (error) {
      console.error('Error clearing resolved errors:', error);
      toast.error('Error al eliminar los registros resueltos');
    } finally {
      setIsClearingResolved(false);
    }
  }, []);

  return {
    errors,
    loading,
    activeTab,
    isLoading: loading,
    isClearing,
    isClearingResolved,
    setActiveTab,
    fetchErrors: loadErrors,
    loadErrors,
    handleMarkAsResolved: handleResolveError,
    handleResolveError,
    handleDeleteError,
    handleClearErrors,
    handleClearResolvedErrors
  };
};
