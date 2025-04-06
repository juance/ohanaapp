
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  title = "Error" 
}) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
