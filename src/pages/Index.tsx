
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, PlusCircle, ShoppingBasket, Clock, CheckSquare, ChevronRight, Search, User, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderClientPortalCard = () => (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Portal para Clientes</h2>
          <User className="h-6 w-6 text-indigo-500" />
        </div>
        <p className="text-gray-500 mb-4">Consulta el estado de tus tickets</p>
        <Link to="/user-tickets">
          <Button variant="outline" className="w-full">
            Consultar Tickets
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  const renderAuthCard = () => (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-indigo-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Acceso al Sistema</h2>
          <LogIn className="h-6 w-6 text-indigo-500" />
        </div>
        <p className="text-gray-500 mb-4">Inicia sesión o crea una cuenta nueva</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/auth')}
        >
          Acceder
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  // Different card sets based on user role
  const renderAdminOperatorCards = () => (
    <>
      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Crear Ticket</h2>
            <PlusCircle className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-gray-500 mb-4">Generar un nuevo ticket para un pedido</p>
          <Link to="/tickets">
            <Button className="w-full">
              Crear Ticket
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pedidos por Retirar</h2>
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-gray-500 mb-4">Gestionar los pedidos listos para retirar</p>
          <Link to="/pickup">
            <Button variant="outline" className="w-full">
              Ver Pedidos
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pedidos Entregados</h2>
            <CheckSquare className="h-6 w-6 text-green-500" />
          </div>
          <p className="text-gray-500 mb-4">Ver historial de pedidos entregados</p>
          <Link to="/delivered">
            <Button variant="outline" className="w-full">
              Ver Historial
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {user?.role === 'admin' && (
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <ShoppingBasket className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-gray-500 mb-4">Ver estadísticas y métricas</p>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                Ver Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Clientes</h2>
            <ShoppingBag className="h-6 w-6 text-orange-500" />
          </div>
          <p className="text-gray-500 mb-4">Gestionar listado de clientes</p>
          <Link to="/clients">
            <Button variant="outline" className="w-full">
              Ver Clientes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {renderClientPortalCard()}
    </>
  );

  const renderClientCards = () => (
    <>
      {renderClientPortalCard()}
    </>
  );

  const renderGuestCards = () => (
    <>
      {renderClientPortalCard()}
      {renderAuthCard()}
    </>
  );

  // Select which cards to render based on user role
  const renderCards = () => {
    if (!user) {
      return renderGuestCards();
    }

    switch (user.role) {
      case 'admin':
      case 'operator':
        return renderAdminOperatorCards();
      case 'client':
        return renderClientCards();
      default:
        return renderGuestCards();
    }
  };

  return (
    <Layout>
      <header className="mb-8 pt-6">
        <h1 className="text-2xl font-bold text-blue-600">Lavandería Ohana</h1>
        <p className="text-gray-500">Sistema de gestión</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderCards()}
      </div>
    </Layout>
  );
};

export default Index;
