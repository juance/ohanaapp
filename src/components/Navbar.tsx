
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Package,
  Truck,
  CheckSquare,
  BarChart,
  PieChart,
  DollarSign,
  Menu,
  X,
  LogOut,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear auth state
    // For now, just redirect to login page
    window.location.href = '/';
  };
  
  const menuLinks = [
    { 
      href: '/administration', 
      label: 'Administración', 
      icon: <Settings className="h-5 w-5 mr-3" /> 
    },
    { 
      href: '/tickets', 
      label: 'Tickets', 
      icon: <Receipt className="h-5 w-5 mr-3" /> 
    },
    { 
      href: '/pickup-orders', 
      label: 'Órdenes de recogida', 
      icon: <Truck className="h-5 w-5 mr-3" /> 
    },
    { 
      href: '/delivered-orders', 
      label: 'Órdenes entregadas', 
      icon: <CheckSquare className="h-5 w-5 mr-3" /> 
    },
    { 
      href: '/expenses', 
      label: 'Gastos', 
      icon: <DollarSign className="h-5 w-5 mr-3" /> 
    },
    { 
      href: '/feedback', 
      label: 'Comentarios y Fidelidad', 
      icon: <MessageSquare className="h-5 w-5 mr-3" /> 
    }
  ];
  
  // Base navbar JSX
  const navbarContent = (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b bg-white">
        <Link to="/dashboard" className="text-lg font-semibold text-primary">
          LaundrySystem
        </Link>
        
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm ${
                    location.pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={isMobile ? toggleMenu : undefined}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button 
          variant="destructive" 
          className="w-full flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  );
  
  // Return different layouts based on screen size
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
          <div className="flex items-center justify-between h-16 px-4">
            <Link to="/dashboard" className="text-lg font-semibold text-primary">
              LaundrySystem
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile drawer menu that slides in */}
        <div 
          className={`fixed inset-0 z-30 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out pt-16 bg-white`}
        >
          <div className="h-full flex flex-col">
            {navbarContent}
          </div>
        </div>
        
        {/* Add top padding to content when on mobile */}
        <div className="h-16"></div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r z-30 flex flex-col">
      {navbarContent}
    </div>
  );
};

export default Navbar;
