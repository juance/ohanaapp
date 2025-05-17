
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  className = '', 
  text = 'Cargando...', 
  size = 'md',
  center = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const wrapperClasses = center 
    ? `flex items-center justify-center ${className}` 
    : `flex items-center ${className}`;

  return (
    <div className={wrapperClasses}>
      <Loader2 className={`animate-spin mr-2 ${sizeClasses[size]}`} />
      {text && <span>{text}</span>}
    </div>
  );
};
