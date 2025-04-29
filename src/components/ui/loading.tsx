
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className = '', text = 'Cargando...' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin mr-2" />
      <span>{text}</span>
    </div>
  );
};
