import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings, 
  ClipboardList, 
  ChartBar,
  ShoppingCart,
  Archive,
  DollarSign,
  MessageSquare,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const navItems = [
    { to: '/', icon: <Home className="mr-2 h-5 w-5" />, label: 'Inicio' },
    { to: '/clients', icon: <Users className="mr-2 h-5 w-5" />, label: 'Clientes' },
    { to: '/tickets', icon: <ClipboardList className="mr-2 h-5 w-5" />, label: 'Tickets' },
    { to: '/pending-orders', icon: <ShoppingCart className="mr-2 h-5 w-5" />, label: 'Órdenes Pendientes' },
    { to: '/delivered-orders', icon: <Archive className="mr-2 h-5 w-5" />, label: 'Órdenes Entregadas' },
    { to: '/loyalty', icon: <Users className="mr-2 h-5 w-5" />, label: 'Programa de Fidelidad' },
    { to: '/inventory', icon: <Package className="mr-2 h-5 w-5" />, label: 'Inventario' },
    { to: '/expenses', icon: <DollarSign className="mr-2 h-5 w-5" />, label: 'Gastos' },
    { to: '/feedback', icon: <MessageSquare className="mr-2 h-5 w-5" />, label: 'Comentarios' },
    { to: '/metrics', icon: <ChartBar className="mr-2 h-5 w-5" />, label: 'Métricas' },
    { to: '/settings', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Configuración' },
    { to: '/administration', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Administración' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 flex items-center justify-between z-20 md:hidden">
        <span className="font-semibold">Ohana Laundry App</span>
        <button
          onClick={toggleMenu}
          className="focus:outline-none"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={toggleMenu}>
          <div 
            className="fixed top-0 right-0 w-64 h-full bg-blue-600 p-4 pt-16 shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="flex items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700"
                  onClick={toggleMenu}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 mt-auto">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center rounded-lg px-4 py-2 text-gray-100 hover:bg-blue-700"
                >
                  <X className="mr-2 h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
