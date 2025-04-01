
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Receipt,
  Package2,
  PackageCheck,
  Users,
  Settings,
  Menu,
  X,
  Warehouse,
  BanknoteIcon,
  User,
  LogOut,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';
import { toast } from 'sonner';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user');
      toast.success('Sesión cerrada correctamente');
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const isAdmin = user && user.role === 'admin';

  // Define navigation items for better organization
  const navItems = [
    { 
      path: "/tickets", 
      label: "Crear Tickets", 
      icon: <Receipt className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/orders/pickup", 
      label: "Pedidos a Retirar", 
      icon: <Package2 className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/orders/delivered", 
      label: "Pedidos Entregados", 
      icon: <PackageCheck className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/inventory", 
      label: "Inventario", 
      icon: <Warehouse className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/clients", 
      label: "Clientes", 
      icon: <User className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/expenses", 
      label: "Gastos", 
      icon: <BanknoteIcon className="h-5 w-5" />,
      showFor: "all" 
    },
    { 
      path: "/users", 
      label: "Usuarios", 
      icon: <Users className="h-5 w-5" />,
      showFor: "admin" 
    },
    { 
      path: "/settings", 
      label: "Configuración", 
      icon: <Settings className="h-5 w-5" />,
      showFor: "admin" 
    }
  ];

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
            <Receipt className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Lavandería Ohana</span>
          </Link>
        </div>

        <nav className="space-y-1 px-4 flex flex-col h-[calc(100%-180px)]">
          {navItems.map((item, index) => (
            ((item.showFor === "all") || (item.showFor === "admin" && isAdmin)) && (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-3 rounded-md transition-colors hover:text-blue-600 hover:bg-blue-50",
                  isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-muted-foreground"
                )}
                onClick={closeMenu}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          ))}
          
          <div className="mt-auto">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-start space-x-2 px-4 py-3 rounded-md text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </Button>
          </div>
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
