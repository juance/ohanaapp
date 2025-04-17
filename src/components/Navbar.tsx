
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart, ShoppingBag, Users, Ticket, Award, Settings, DollarSign, FileText, LogOut, User, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/lib/types/auth';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/AnimatedLogo';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { QuickResetButton } from '@/components/admin/QuickResetButton';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, checkUserPermission } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define navigation items with required roles
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <BarChart className="h-4 w-4" />, roles: ['admin' as Role] },
    { path: '/tickets', name: 'Tickets', icon: <Ticket className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/pickup', name: 'Pedidos a Retirar', icon: <ShoppingBag className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/delivered', name: 'Entregados', icon: <FileText className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/clients', name: 'Clientes', icon: <Users className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/loyalty', name: 'Programa de Fidelidad', icon: <Award className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/analysis', name: 'Análisis de Tickets', icon: <FileText className="h-4 w-4" />, roles: ['admin' as Role] },
    { path: '/expenses', name: 'Gastos', icon: <DollarSign className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role] },
    { path: '/administration', name: 'Administración', icon: <Settings className="h-4 w-4" />, roles: ['admin' as Role] },
    { path: '/feedback', name: 'Comentarios', icon: <FileText className="h-4 w-4" />, roles: ['admin' as Role] },
    { path: '/diagnostics', name: 'Diagnóstico', icon: <AlertTriangle className="h-4 w-4" />, roles: ['admin' as Role] },
    { path: '/user-tickets', name: 'Portal para Clientes', icon: <User className="h-4 w-4" />, roles: ['admin' as Role, 'operator' as Role, 'client' as Role] },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item =>
    user && checkUserPermission(item.roles)
  );

  return (
    <div className="fixed hidden h-screen w-64 bg-white border-r md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <AnimatedLogo size="lg" />
        </div>

        {user && (
          <div className="p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
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
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">Tema</div>
            <ModeToggle />
          </div>

          {user && user.role === 'admin' && (
            <div className="mb-4">
              <QuickResetButton />
            </div>
          )}

          {user ? (
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/auth')}
            >
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}
          <div className="text-xs text-gray-500 mt-4">
            © 2025 Lavandería Ohana
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
