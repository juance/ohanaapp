import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Package2,
  PackageCheck,
  Users,
  Settings,
  Menu,
  X,
  Warehouse,
  BanknoteIcon,
  User,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getCurrentUser, hasPermission } from '@/lib/auth';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out",
          {
            "translate-x-0": isOpen || !isMobile,
            "-translate-x-full": !isOpen && isMobile,
          }
        )}
      >
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Lavandería Ohana</span>
          </Link>
        </div>

        <nav className="space-y-1 px-4">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/dashboard") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/tickets"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/tickets") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <Receipt className="h-5 w-5" />
            <span>Crear Tickets</span>
          </Link>

          <Link
            to="/orders/pickup"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/orders/pickup") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <Package2 className="h-5 w-5" />
            <span>Para Retirar</span>
          </Link>

          <Link
            to="/orders/delivered"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/orders/delivered") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <PackageCheck className="h-5 w-5" />
            <span>Entregados</span>
          </Link>

          <Link
            to="/inventory"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/inventory") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <Warehouse className="h-5 w-5" />
            <span>Inventario</span>
          </Link>

          <Link
            to="/expenses"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/expenses") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <BanknoteIcon className="h-5 w-5" />
            <span>Gastos</span>
          </Link>

          <Link
            to="/clients"
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
              isActive("/clients") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
            )}
            onClick={closeMenu}
          >
            <User className="h-5 w-5" />
            <span>Clientes</span>
          </Link>

          {isAdmin && (
            <Link
              to="/users"
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
                isActive("/users") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
              )}
              onClick={closeMenu}
            >
              <Users className="h-5 w-5" />
              <span>Usuarios</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/settings"
              className={cn(
                "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
                isActive("/settings") ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
              )}
              onClick={closeMenu}
            >
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
          )}
        </nav>
      </div>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
