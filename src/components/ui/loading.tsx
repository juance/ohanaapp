
import React from 'react';

interface LoadingProps {
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center items-center p-8 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};
