
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { ResetDataComponent } from '@/components/admin/ResetDataComponent';

const Admin = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 p-6 md:ml-64">
        <div className="container mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Administración del Sistema</h1>
          
          <Tabs defaultValue="system">
            <TabsList className="mb-4">
              <TabsTrigger value="system">Sistema</TabsTrigger>
              <TabsTrigger value="reset">Reiniciar Datos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-6">
              <SystemSettings />
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-6">
              <ResetDataComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
