
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  ClipboardList,
  CheckSquare,
  Package,
  Truck,
  BarChart2,
  Clipboard,
  Settings,
  MessageSquare,
  DollarSign,
  LayoutDashboard,
  TrendingUp,
  Award
} from 'lucide-react';
import { NotificationBell } from './ui/notification-bell';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-600 hover:text-white';
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-blue-800 text-white p-4 hidden md:block">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/" className="text-xl font-bold">Lavandería Ohana</Link>
        </div>
        <NotificationBell />
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/')}`}>
              <Home className="h-5 w-5" />
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/dashboard')}`}>
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/tickets" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/tickets')}`}>
              <ClipboardList className="h-5 w-5" />
              <span>Nuevo Ticket</span>
            </Link>
          </li>
          <li>
            <Link to="/pending-orders" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/pending-orders')}`}>
              <Clipboard className="h-5 w-5" />
              <span>Pedidos Pendientes</span>
            </Link>
          </li>
          <li>
            <Link to="/pickup-orders" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/pickup-orders')}`}>
              <CheckSquare className="h-5 w-5" />
              <span>Listos para Entrega</span>
            </Link>
          </li>
          <li>
            <Link to="/delivered-orders" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/delivered-orders')}`}>
              <Package className="h-5 w-5" />
              <span>Pedidos Entregados</span>
            </Link>
          </li>
          <li>
            <Link to="/clients" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/clients')}`}>
              <User className="h-5 w-5" />
              <span>Clientes</span>
            </Link>
          </li>
          <li>
            <Link to="/loyalty" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/loyalty')}`}>
              <Award className="h-5 w-5" />
              <span>Programa de Lealtad</span>
            </Link>
          </li>
          <li>
            <Link to="/inventory" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/inventory')}`}>
              <Truck className="h-5 w-5" />
              <span>Inventario</span>
            </Link>
          </li>
          <li>
            <Link to="/expenses" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/expenses')}`}>
              <DollarSign className="h-5 w-5" />
              <span>Gastos</span>
            </Link>
          </li>
          <li>
            <Link to="/metrics" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/metrics')}`}>
              <BarChart2 className="h-5 w-5" />
              <span>Métricas</span>
            </Link>
          </li>
          <li>
            <Link to="/trends" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/trends')}`}>
              <TrendingUp className="h-5 w-5" />
              <span>Tendencias</span>
            </Link>
          </li>
          <li>
            <Link to="/feedback" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/feedback')}`}>
              <MessageSquare className="h-5 w-5" />
              <span>Comentarios</span>
            </Link>
          </li>
          <li>
            <Link to="/admin" className={`flex items-center space-x-2 p-2 rounded-md ${isActive('/admin')}`}>
              <Settings className="h-5 w-5" />
              <span>Administración</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
