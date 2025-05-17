
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Settings, 
  ClipboardList, 
  ChartBar, 
  LogOut, 
  ShoppingCart, 
  Archive, 
  DollarSign,
  MessageSquare,
  Inventory
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { to: '/', icon: <Home className="mr-2 h-5 w-5" />, label: 'Inicio' },
    { to: '/clients', icon: <Users className="mr-2 h-5 w-5" />, label: 'Clientes' },
    { to: '/tickets', icon: <ClipboardList className="mr-2 h-5 w-5" />, label: 'Tickets' },
    { to: '/pending-orders', icon: <ShoppingCart className="mr-2 h-5 w-5" />, label: 'Órdenes Pendientes' },
    { to: '/delivered-orders', icon: <Archive className="mr-2 h-5 w-5" />, label: 'Órdenes Entregadas' },
    { to: '/loyalty', icon: <Users className="mr-2 h-5 w-5" />, label: 'Programa de Fidelidad' },
    { to: '/inventory', icon: <Inventory className="mr-2 h-5 w-5" />, label: 'Inventario' },
    { to: '/expenses', icon: <DollarSign className="mr-2 h-5 w-5" />, label: 'Gastos' },
    { to: '/feedback', icon: <MessageSquare className="mr-2 h-5 w-5" />, label: 'Comentarios' },
    { to: '/settings', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Configuración' },
  ];

  // Admin only items
  const adminItems = [
    { to: '/administration', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Administración' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-blue-600 text-white z-10 shadow-lg hidden md:block">
      <div className="flex items-center justify-center h-20">
        <span className="text-lg font-semibold">Ohana Laundry App</span>
      </div>
      
      <div className="flex flex-col space-y-1 px-4 h-[calc(100%-80px)] justify-between overflow-y-auto">
        <div className="flex flex-col space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          {/* Add Analytics Section */}
          <div className="pt-4 pb-2">
            <h2 className="text-sm font-semibold text-blue-200 px-4">Análisis</h2>
          </div>
          <Link
            to="/metrics"
            className="flex items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700"
          >
            <ChartBar className="mr-2 h-5 w-5" />
            <span>Métricas</span>
          </Link>

          {/* Admin Section */}
          <div className="pt-4 pb-2">
            <h2 className="text-sm font-semibold text-blue-200 px-4">Administración</h2>
          </div>
          {adminItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Logout section */}
        <div className="pb-8">
          <Button 
            variant="ghost" 
            className="w-full flex items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700 justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
