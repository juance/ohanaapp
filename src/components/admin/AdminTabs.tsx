
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./GeneralSettings";
import { TicketSettings } from "./TicketSettings";
import { ErrorLogs } from "./ErrorLogs";
import { SystemSettings } from "./SystemSettings";

interface AdminTabsProps {
  defaultTab?: string;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ defaultTab = "general" }) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="errors">Errores</TabsTrigger>
        <TabsTrigger value="system">Sistema</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-6">
        <GeneralSettings />
      </TabsContent>
      
      <TabsContent value="tickets" className="space-y-6">
        <TicketSettings />
      </TabsContent>
      
      <TabsContent value="errors" className="space-y-6">
        <ErrorLogs />
      </TabsContent>
      
      <TabsContent value="system" className="space-y-6">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};
