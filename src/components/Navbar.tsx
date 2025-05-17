
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Clipboard, DollarSign, Users, 
  Settings, ChevronRight, Menu, X, BarChart,
  FileText, Award, Package2, MessageSquare
} from 'lucide-react';
import { ConnectionStatusBar } from './ui/connection-status-bar';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, text, active, onClick }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded transition-colors ${
        active ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
      <ChevronRight className="ml-auto h-4 w-4" />
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md bg-white shadow text-gray-700"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">Lavandería Ohana</h1>
            <p className="text-sm text-gray-500">Sistema de Gestión</p>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLink
              to="/dashboard"
              icon={<Home className="h-5 w-5" />}
              text="Panel de Control"
              active={currentPath === '/' || currentPath === '/dashboard'}
              onClick={closeMenu}
            />
            <NavLink
              to="/tickets"
              icon={<Clipboard className="h-5 w-5" />}
              text="Tickets"
              active={currentPath === '/tickets'}
              onClick={closeMenu}
            />
            <NavLink
              to="/pickup"
              icon={<Package className="h-5 w-5" />}
              text="Órdenes Pendientes"
              active={currentPath === '/pickup'}
              onClick={closeMenu}
            />
            <NavLink
              to="/delivered"
              icon={<FileText className="h-5 w-5" />}
              text="Órdenes Entregadas"
              active={currentPath === '/delivered'}
              onClick={closeMenu}
            />
            <NavLink
              to="/clients"
              icon={<Users className="h-5 w-5" />}
              text="Clientes"
              active={currentPath === '/clients'}
              onClick={closeMenu}
            />
            <NavLink
              to="/loyalty"
              icon={<Award className="h-5 w-5" />}
              text="Programa de Fidelidad"
              active={currentPath === '/loyalty'}
              onClick={closeMenu}
            />
            <NavLink
              to="/inventory"
              icon={<Package2 className="h-5 w-5" />}
              text="Inventario"
              active={currentPath === '/inventory'}
              onClick={closeMenu}
            />
            <NavLink
              to="/metrics"
              icon={<BarChart className="h-5 w-5" />}
              text="Métricas"
              active={currentPath === '/metrics'}
              onClick={closeMenu}
            />
            <NavLink
              to="/analysis"
              icon={<FileText className="h-5 w-5" />}
              text="Análisis de Tickets"
              active={currentPath === '/analysis'}
              onClick={closeMenu}
            />
            <NavLink
              to="/expenses"
              icon={<DollarSign className="h-5 w-5" />}
              text="Gastos"
              active={currentPath === '/expenses'}
              onClick={closeMenu}
            />
            <NavLink
              to="/admin"
              icon={<Settings className="h-5 w-5" />}
              text="Administración"
              active={currentPath === '/admin'}
              onClick={closeMenu}
            />
            <NavLink
              to="/feedback"
              icon={<MessageSquare className="h-5 w-5" />}
              text="Comentarios"
              active={currentPath === '/feedback'}
              onClick={closeMenu}
            />
          </nav>

          {/* Bottom section with connection status */}
          <div className="p-4 border-t">
            <ConnectionStatusBar variant="compact" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
