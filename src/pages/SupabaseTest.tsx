
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SupabaseConnectionTest } from '@/components/admin/SupabaseConnectionTest';

const SupabaseTest = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="container mx-auto pt-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
            <h1 className="text-2xl font-bold">Diagnostico de Supabase</h1>
            <div className="w-24"></div> {/* Spacer para mantener el título centrado */}
          </div>

          <div className="space-y-6">
            <SupabaseConnectionTest />
            
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h2 className="text-xl font-semibold text-amber-700 mb-2">Información sobre el error "This project does not exist"</h2>
              <p className="text-amber-800 mb-3">
                Si estás viendo el error "This project does not exist" en el panel de control de Supabase,
                podría deberse a alguna de las siguientes razones:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-amber-800">
                <li>El proyecto ha sido eliminado de tu cuenta de Supabase</li>
                <li>No tienes permisos para acceder al proyecto</li>
                <li>Estás intentando acceder con una URL incorrecta</li>
                <li>El proyecto está en pausa o ha sido suspendido</li>
              </ul>
              <p className="mt-3 text-amber-800">
                Si la aplicación sigue funcionando a pesar de este error, es posible que solo sea un problema
                de acceso al panel de control pero la API siga funcionando correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
