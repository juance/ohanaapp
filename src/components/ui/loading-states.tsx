
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

export const TicketServicesSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const FullPageLoader: React.FC<{ message?: string }> = ({ 
  message = "Cargando..." 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    <p className="text-gray-600">{message}</p>
  </div>
);

export const InlineLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
  );
};
