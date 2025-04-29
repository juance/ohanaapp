
import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
      <div>{message}</div>
    </div>
  );
};
