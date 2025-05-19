
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemError } from '@/lib/types/error.types';

interface ErrorLogsTabsProps {
  errors: SystemError[];
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const ErrorLogsTabs: React.FC<ErrorLogsTabsProps> = ({ 
  errors, 
  activeTab, 
  onTabChange,
  children 
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="mb-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          Todos ({errors.length})
        </TabsTrigger>
        <TabsTrigger value="active">
          Activos ({errors.filter(e => !e.resolved).length})
        </TabsTrigger>
        <TabsTrigger value="resolved">
          Resueltos ({errors.filter(e => e.resolved).length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab}>
        {children}
      </TabsContent>
    </Tabs>
  );
};
