
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ToastContainer } from '@/components/ui/toast-container';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="container mx-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
      <ToastContainer />
    </SidebarProvider>
  );
}
