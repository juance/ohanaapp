import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Settings, ClipboardList, ChartBar } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: <Home className="mr-2 h-5 w-5" />, label: 'Inicio' },
    { to: '/clients', icon: <Users className="mr-2 h-5 w-5" />, label: 'Clientes' },
    { to: '/tickets', icon: <ClipboardList className="mr-2 h-5 w-5" />, label: 'Tickets' },
    { to: '/settings', icon: <Settings className="mr-2 h-5 w-5" />, label: 'Configuración' },
  ];

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-blue-600 text-white z-10 shadow-lg hidden md:block">
      <div className="flex items-center justify-center h-20">
        <span className="text-lg font-semibold">Ohana Laundry App</span>
      </div>
      
      <div className="flex flex-col space-y-1 px-4">
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
        
      </div>
    </nav>
  );
};

export default Navbar;
