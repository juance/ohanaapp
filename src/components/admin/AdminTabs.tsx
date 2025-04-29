
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from './UserManagement';
import { SystemSettings } from './SystemSettings';
import { TicketSettings } from './TicketSettings';
import { ResetCounters } from './ResetCounters';
import { UnretrievedTickets } from './UnretrievedTickets';
import { ErrorLogs } from './ErrorLogs';
import DataReset from './DataReset'; // Changed to default import
import FileManagement from './FileManagement'; // Changed to default import
import { SystemVersions } from './SystemVersions';

interface AdminTabsProps {
  defaultTab?: string;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ 
  defaultTab = "general" 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 mb-8">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="users">Usuarios</TabsTrigger>
        <TabsTrigger value="tickets">Tickets</TabsTrigger>
        <TabsTrigger value="counters">Contadores</TabsTrigger>
        <TabsTrigger value="unretrieved">No Retirados</TabsTrigger>
        <TabsTrigger value="errors">Errores</TabsTrigger>
        <TabsTrigger value="reset">Reseteo</TabsTrigger>
        <TabsTrigger value="files">Archivos</TabsTrigger>
        <TabsTrigger value="versions">Versiones</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <SystemSettings />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UserManagement />
      </TabsContent>
      
      <TabsContent value="tickets" className="space-y-4">
        <TicketSettings />
      </TabsContent>
      
      <TabsContent value="counters" className="space-y-4">
        <ResetCounters />
      </TabsContent>
      
      <TabsContent value="unretrieved" className="space-y-4">
        <UnretrievedTickets />
      </TabsContent>
      
      <TabsContent value="errors" className="space-y-4">
        <ErrorLogs />
      </TabsContent>
      
      <TabsContent value="reset" className="space-y-4">
        <DataReset />
      </TabsContent>
      
      <TabsContent value="files" className="space-y-4">
        <FileManagement />
      </TabsContent>
      
      <TabsContent value="versions" className="space-y-4">
        <SystemVersions />
      </TabsContent>
    </Tabs>
  );
};
