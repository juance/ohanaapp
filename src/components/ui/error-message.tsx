
import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, title, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
      <div className="flex items-start">
        <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
        <div className="flex-1">
          {title && (
            <h4 className="text-sm font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm">{message}</div>
        </div>
      </div>
      
      {onRetry && (
        <div className="mt-3 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="text-red-600 hover:text-red-700"
          >
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
};
