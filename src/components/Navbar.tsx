
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUserAuth } from '@/hooks/use-user-auth';
import { cn } from '@/lib/utils';
import { 
  LogOut, 
  Menu, 
  ShoppingBag, 
  Package, 
  PackageCheck, 
  DollarSign, 
  Users, 
  Package2, 
  Award, 
  MessageSquare, 
  LayoutDashboard,
  BarChart,
  LineChart
} from 'lucide-react';

const Navbar = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isAdmin } = useUserAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const NavItems = [
    {
      name: 'Panel de Control',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Métricas',
      path: '/metrics',
      icon: <BarChart className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Análisis de Tickets',
      path: '/analysis',
      icon: <LineChart className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Tickets',
      path: '/tickets',
      icon: <ShoppingBag className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Tickets Listos',
      path: '/pickup',
      icon: <Package className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Tickets Entregados',
      path: '/delivered',
      icon: <PackageCheck className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Gastos',
      path: '/expenses',
      icon: <DollarSign className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Clientes',
      path: '/clients',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Programa de Fidelidad',
      path: '/loyalty',
      icon: <Award className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Inventario',
      path: '/inventory',
      icon: <Package2 className="h-5 w-5" />,
      roles: ['admin', 'operator']
    },
    {
      name: 'Feedback de Clientes',
      path: '/feedback',
      icon: <MessageSquare className="h-5 w-5" />,
      roles: ['admin']
    },
    {
      name: 'Administración',
      path: '/admin',
      icon: <DollarSign className="h-5 w-5" />,
      roles: ['admin']
    },
  ];

  return (
    <>
      {/* Mobile navbar */}
      <div className="flex items-center border-b bg-background px-4 py-3 md:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <ScrollArea className="h-full px-2 py-4">
              <div className="flex flex-col gap-1 p-2">
                {NavItems.filter(item => isAdmin || item.roles.includes('operator')).map((item) => (
                  <Link key={item.path} to={item.path} onClick={closeMenu}>
                    <Button
                      variant={pathname === item.path ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </Button>
                  </Link>
                ))}
                <Button variant="ghost" className="w-full justify-start text-red-500" onClick={logout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="ml-4 flex-1 text-center text-lg font-semibold">
          Lavandería App
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex h-full flex-col border-r bg-background">
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="text-lg font-semibold">
              Lavandería App
            </Link>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-1">
              {NavItems.filter(item => isAdmin || item.roles.includes('operator')).map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={pathname === item.path ? 'default' : 'ghost'}
                    className={cn('w-full justify-start', pathname === item.path && 'bg-accent')}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              ))}
              <Button variant="ghost" className="w-full justify-start text-red-500" onClick={logout}>
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Navbar;
