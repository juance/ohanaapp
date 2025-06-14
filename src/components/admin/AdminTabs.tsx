
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './GeneralSettings';
import { SystemSettings } from './SystemSettings';
import { TicketSettings } from './TicketSettings';
import { UserManagement } from './UserManagement';

interface AdminTabsProps {
  defaultTab?: string;
}

export const AdminTabs = ({ defaultTab = "general" }: AdminTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="system">Sistema</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-6">
        <GeneralSettings />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-6">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="tickets" className="space-y-6">
        <TicketSettings />
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};
