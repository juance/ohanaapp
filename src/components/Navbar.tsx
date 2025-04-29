import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, LayoutDashboard, LineChart, BarChart } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    return cn(
      "flex items-center justify-center p-4 text-sm font-medium transition-colors hover:bg-gray-100 md:justify-start md:pl-6 md:pr-3",
      location.pathname === path ? "bg-gray-100" : ""
    );
  };
  
  return (
    <div className="fixed bottom-0 z-10 w-full border-t border-gray-200 bg-white md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:border-r md:border-t-0">
      <div className="hidden h-20 items-center justify-center border-b px-6 md:flex">
        <Link to="/" className="text-lg font-semibold">
          Lavandería Ohana
        </Link>
      </div>
      <nav className="grid grid-cols-5 md:block">
        
        <Link to="/" className={getLinkClasses('/')}>
          <Home size={20} />
          <span className="sr-only md:not-sr-only md:ml-2">Inicio</span>
        </Link>
        
        <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
          <LayoutDashboard size={20} />
          <span className="sr-only md:not-sr-only md:ml-2">Dashboard</span>
        </Link>
        
        <Link to="/metrics" className={getLinkClasses('/metrics')}>
          <BarChart size={20} />
          <span className="sr-only md:not-sr-only md:ml-2">Métricas</span>
        </Link>
        
        <Link to="/analysis" className={getLinkClasses('/analysis')}>
          <LineChart size={20} />
          <span className="sr-only md:not-sr-only md:ml-2">Análisis</span>
        </Link>
        
      </nav>
      <div className="mt-auto hidden p-6 md:block">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Lavandería Ohana
        </p>
      </div>
    </div>
  );
};

export default Navbar;
