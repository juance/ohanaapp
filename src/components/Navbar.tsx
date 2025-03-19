import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Truck, 
  Users, 
  Menu, 
  X, 
  DollarSign,
  UserCircle,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Mobile nav */}
      <div className="md:hidden bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-laundry-500" />
            <span className="text-xl font-bold">LaundryPro</span>
          </Link>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {isOpen && (
          <div className="p-4 space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Home className="w-5 h-5 mr-2 text-gray-500" />
              Dashboard
            </Link>
            <Link
              to="/tickets"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <ShoppingBag className="w-5 h-5 mr-2 text-gray-500" />
              Tickets
            </Link>
            <Link
              to="/orders/pickup"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Órdenes para Retirar
            </Link>
            <Link
              to="/orders/delivered"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Truck className="w-5 h-5 mr-2 text-gray-500" />
              Órdenes Entregadas
            </Link>
            <Link
              to="/analysis"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <BarChart className="w-5 h-5 mr-2 text-gray-500" />
              Análisis de Tickets
            </Link>
            <Link
              to="/inventory"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Inventario
            </Link>
            <Link
              to="/expenses"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              Gastos
            </Link>
            <Link
              to="/clients"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <UserCircle className="w-5 h-5 mr-2 text-gray-500" />
              Clientes
            </Link>
            <Link
              to="/users"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              Usuarios
            </Link>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 flex-col hidden w-64 h-screen bg-white border-r md:flex">
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-laundry-500" />
            <span className="text-xl font-bold">LaundryPro</span>
          </Link>
        </div>
        
        <div className="p-4 h-full overflow-auto">
          <nav className="space-y-2 text-sm">
            <Link
              to="/dashboard"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Home className="w-5 h-5 mr-2 text-gray-500" />
              Dashboard
            </Link>
            <Link
              to="/tickets"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ShoppingBag className="w-5 h-5 mr-2 text-gray-500" />
              Tickets
            </Link>
            <Link
              to="/orders/pickup"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Órdenes para Retirar
            </Link>
            <Link
              to="/orders/delivered"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Truck className="w-5 h-5 mr-2 text-gray-500" />
              Órdenes Entregadas
            </Link>
            <Link
              to="/analysis"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <BarChart className="w-5 h-5 mr-2 text-gray-500" />
              Análisis de Tickets
            </Link>
            <Link
              to="/inventory"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Package className="w-5 h-5 mr-2 text-gray-500" />
              Inventario
            </Link>
            <Link
              to="/expenses"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              Gastos
            </Link>
            <Link
              to="/clients"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <UserCircle className="w-5 h-5 mr-2 text-gray-500" />
              Clientes
            </Link>
            <Link
              to="/users"
              className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Users className="w-5 h-5 mr-2 text-gray-500" />
              Usuarios
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
