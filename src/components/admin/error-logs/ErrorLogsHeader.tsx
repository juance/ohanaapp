
import React from 'react';
import { AlertTriangle } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ErrorLogsActions } from './ErrorLogsActions';
import { SystemError } from '@/lib/types/error.types';

interface ErrorLogsHeaderProps {
  errors: SystemError[];
  isLoading: boolean;
  isClearing: boolean;
  isClearingResolved: boolean;
  onRefresh: () => void;
  onClearAll: () => Promise<void>;
  onClearResolved: () => Promise<void>;
}

export const ErrorLogsHeader: React.FC<ErrorLogsHeaderProps> = ({
  errors,
  isLoading,
  isClearing,
  isClearingResolved,
  onRefresh,
  onClearAll,
  onClearResolved
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <CardTitle>Registro de Errores</CardTitle>
        </div>
        <ErrorLogsActions
          errors={errors}
          isLoading={isLoading}
          isClearing={isClearing}
          isClearingResolved={isClearingResolved}
          onRefresh={onRefresh}
          onClearAll={onClearAll}
          onClearResolved={onClearResolved}
        />
      </div>
      <CardDescription>
        Registro de errores del sistema para ayudar en la resolución de problemas
      </CardDescription>
    </>
  );
};
