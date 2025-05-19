
import { useState, useCallback } from 'react';
import { getAllErrors, markErrorAsResolved, deleteError } from '@/lib/errorService';
import { SystemError } from '@/lib/types/error.types';
import { toast } from '@/lib/toast';

export const useErrorLogs = () => {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const fetchErrors = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedErrors = await getAllErrors();
      // Convert to the proper SystemError type from error.types.ts
      const typedErrors: SystemError[] = fetchedErrors.map(error => ({
        ...error,
        // Ensure the level property is correctly typed
        level: error.level as SystemError['level']
      }));
      setErrors(typedErrors);
    } catch (error) {
      console.error('Error fetching errors:', error);
      toast.error('Error al cargar los registros de errores');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkAsResolved = useCallback(async (errorId: string) => {
    try {
      await markErrorAsResolved(errorId);
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

  return {
    errors,
    loading,
    activeTab,
    setActiveTab,
    fetchErrors,
    handleMarkAsResolved,
    handleDeleteError
  };
};
