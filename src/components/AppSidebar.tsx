
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  Clipboard,
  Package,
  Clock,
  FileText,
  Users,
  Award,
  Package2,
  TrendingUp,
  BarChart3,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const mainItems = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Tickets',
      url: '/tickets',
      icon: Clipboard,
    },
    {
      title: 'Órdenes Pendientes',
      url: '/pickup',
      icon: Clock,
    },
    {
      title: 'Órdenes Entregadas',
      url: '/delivered',
      icon: FileText,
    },
  ];

  const managementItems = [
    {
      title: 'Clientes',
      url: '/clients',
      icon: Users,
    },
    {
      title: 'Programa de Fidelidad',
      url: '/loyalty',
      icon: Award,
    },
    {
      title: 'Inventario',
      url: '/inventory',
      icon: Package2,
    },
  ];

  const analyticsItems = [
    {
      title: 'Métricas',
      url: '/metrics',
      icon: TrendingUp,
    },
    {
      title: 'Análisis de Tickets',
      url: '/ticket-analysis',
      icon: BarChart3,
    },
    {
      title: 'Gastos',
      url: '/expenses',
      icon: DollarSign,
    },
    {
      title: 'Comentarios',
      url: '/feedback',
      icon: MessageSquare,
    },
  ];

  const systemItems = [
    {
      title: 'Administración',
      url: '/admin',
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            O
          </div>
          <div>
            <h1 className="text-lg font-semibold">Lavandería Ohana</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Análisis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <Button 
          variant="destructive" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
