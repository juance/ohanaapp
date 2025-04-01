
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ClientListSkeleton: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClientListSkeleton;
