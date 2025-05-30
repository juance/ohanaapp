
import React from 'react';

interface LoadingProps {
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className = "h-6 w-6" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`}>
    </div>
  );
};
