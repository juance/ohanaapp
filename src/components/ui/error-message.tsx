
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void | Promise<void>;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title, onRetry }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-red-200 bg-red-50 rounded-lg text-red-700">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">{title || 'Error'}</span>
      </div>
      <p className="text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );
};
