
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  TicketIcon, LayoutDashboardIcon, UserIcon, PackageIcon, 
  SendIcon, TruckIcon, BarChart3Icon, Settings2Icon, LogOutIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="h-5 w-5" /> },
  { path: '/tickets', label: 'Tickets', icon: <TicketIcon className="h-5 w-5" /> },
  { path: '/clients', label: 'Clientes', icon: <UserIcon className="h-5 w-5" /> },
  { path: '/inventory', label: 'Inventario', icon: <PackageIcon className="h-5 w-5" /> },
  { path: '/pickup-orders', label: 'Órdenes de Recogida', icon: <SendIcon className="h-5 w-5" /> },
  { path: '/delivered-orders', label: 'Órdenes Entregadas', icon: <TruckIcon className="h-5 w-5" /> },
  { path: '/ticket-analysis', label: 'Análisis de Tickets', icon: <BarChart3Icon className="h-5 w-5" /> },
  { path: '/metrics', label: 'Métricas', icon: <BarChart3Icon className="h-5 w-5" /> },
  { path: '/expenses', label: 'Gastos', icon: <BarChart3Icon className="h-5 w-5" /> },
  { path: '/user-management', label: 'Gestión de Usuarios', icon: <Settings2Icon className="h-5 w-5" /> },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user');
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full py-4">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-blue-600">Lavandería Ohana</h1>
          <p className="text-sm text-gray-500">Sistema de Gestión</p>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="px-4 py-2 mt-auto border-t">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
