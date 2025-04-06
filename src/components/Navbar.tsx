
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, ShoppingBag, Users, Ticket, Award, Settings, DollarSign, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <BarChart className="h-4 w-4" /> },
    { path: '/tickets', name: 'Tickets', icon: <Ticket className="h-4 w-4" /> },
    { path: '/pickup', name: 'Ordenes Pendientes', icon: <ShoppingBag className="h-4 w-4" /> },
    { path: '/delivered', name: 'Ordenes Entregadas', icon: <FileText className="h-4 w-4" /> },
    { path: '/clients', name: 'Clientes', icon: <Users className="h-4 w-4" /> },
    { path: '/loyalty', name: 'Programa de Fidelidad', icon: <Award className="h-4 w-4" /> },
    { path: '/analysis', name: 'Análisis de Tickets', icon: <FileText className="h-4 w-4" /> },
    { path: '/expenses', name: 'Gastos', icon: <DollarSign className="h-4 w-4" /> },
    { path: '/administration', name: 'Administración', icon: <Settings className="h-4 w-4" /> },
    { path: '/feedback', name: 'Comentarios', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="fixed hidden h-screen w-64 bg-white border-r md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600">Lavandería Ohana</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <div className="text-xs text-gray-500">
            © 2023 Lavandería Ohana
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
