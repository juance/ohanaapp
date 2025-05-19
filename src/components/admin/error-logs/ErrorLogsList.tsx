
import React from 'react';
import { SystemError } from '@/lib/types/error.types';
import { ErrorLogItem } from './ErrorLogItem';

interface ErrorLogsListProps {
  errors: SystemError[];
  activeTab: string;
  isLoading: boolean;
  onResolveError: (errorId: string) => Promise<void>;
  onDeleteError: (errorId: string) => Promise<void>;
}

export const ErrorLogsList: React.FC<ErrorLogsListProps> = ({ 
  errors, 
  activeTab, 
  isLoading, 
  onResolveError, 
  onDeleteError 
}) => {
  // Filter errors according to the active tab
  const filteredErrors = activeTab === 'all'
    ? errors
    : activeTab === 'resolved'
      ? errors.filter(error => error.resolved)
      : errors.filter(error => !error.resolved);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (filteredErrors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {activeTab === 'all'
          ? 'No hay errores registrados en el sistema.'
          : activeTab === 'resolved'
            ? 'No hay errores resueltos.'
            : 'No hay errores activos.'}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto">
      {filteredErrors.map((error) => (
        <ErrorLogItem
          key={error.id}
          error={error}
          onResolve={onResolveError}
          onDelete={onDeleteError}
        />
      ))}
    </div>
  );
};
